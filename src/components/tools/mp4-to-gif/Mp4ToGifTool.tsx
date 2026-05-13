'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { FileUploader } from '../FileUploader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Download, X, Film, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'idle' | 'loading-ffmpeg' | 'processing' | 'complete' | 'error';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Safely convert FFmpeg FileData (string | Uint8Array) to Uint8Array.
 * @ffmpeg/ffmpeg v0.12 readFile() returns FileData which can be either type.
 */
function toUint8Array(data: unknown): Uint8Array<ArrayBuffer> {
  let buf: ArrayBuffer;
  if (data instanceof Uint8Array) {
    buf = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
  } else if (data instanceof ArrayBuffer) {
    buf = data;
  } else if (typeof data === 'string') {
    buf = new TextEncoder().encode(data).buffer as ArrayBuffer;
  } else {
    throw new Error('Unexpected data type from readFile');
  }
  return new Uint8Array(buf);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Mp4ToGifTool() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  // Options
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [width, setWidth] = useState(480);
  const [fps, setFps] = useState(10);

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const ffmpegLoadedRef = useRef(false);
  const cancelledRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fakeProgressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      if (gifUrl) URL.revokeObjectURL(gifUrl);
      if (fakeProgressRef.current) clearInterval(fakeProgressRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Fake progress ticker (FFmpeg WASM often reports 0 for GIF) ──────────────
  const startFakeProgress = useCallback(() => {
    setProgress(5);
    fakeProgressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(fakeProgressRef.current!);
          return 90;
        }
        return p + 2;
      });
    }, 400);
  }, []);

  const stopFakeProgress = useCallback(() => {
    if (fakeProgressRef.current) {
      clearInterval(fakeProgressRef.current);
      fakeProgressRef.current = null;
    }
    setProgress(100);
  }, []);

  // ── File selection ──────────────────────────────────────────────────────────

  const handleFilesSelected = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;

    setFile(f);
    setVideoUrl(URL.createObjectURL(f));
    setGifBlob(null);
    setGifUrl(null);
    setError(null);
    setStatus('idle');
    setProgress(0);
    setLogs([]);
    setStartTime(0);
    setDuration(0);
  }, []);

  const handleRemoveFile = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setFile(null);
    setVideoUrl(null);
    setGifBlob(null);
    setGifUrl(null);
    setError(null);
    setStatus('idle');
    setProgress(0);
    setLogs([]);
  }, [videoUrl, gifUrl]);

  const handleVideoMetadata = useCallback(() => {
    const dur = videoRef.current?.duration ?? 0;
    setVideoDuration(isFinite(dur) ? Math.floor(dur) : 0);
  }, []);

  // ── FFmpeg loading ──────────────────────────────────────────────────────────

  const loadFFmpeg = useCallback(async (): Promise<FFmpeg> => {
    if (ffmpegRef.current && ffmpegLoadedRef.current) return ffmpegRef.current;

    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;

    // Collect logs for debugging
    ffmpeg.on('log', ({ message }) => {
      if (message) {
        setLogs((prev) => [...prev.slice(-30), message]);
        setProgressMsg(message.slice(0, 100));
      }
    });

    setStatus('loading-ffmpeg');
    setProgressMsg('Loading FFmpeg engine…');
    setProgress(0);

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });

    ffmpegLoadedRef.current = true;
    return ffmpeg;
  }, []);

  // ── Conversion ──────────────────────────────────────────────────────────────

  const handleConvert = useCallback(async () => {
    if (!file) return;

    cancelledRef.current = false;
    setError(null);
    setGifBlob(null);
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setGifUrl(null);
    setProgress(0);
    setLogs([]);

    try {
      const ffmpeg = await loadFFmpeg();
      if (cancelledRef.current) return;

      setStatus('processing');
      setProgressMsg('Writing video to memory…');
      startFakeProgress();

      // Write input — use the file's actual extension so FFmpeg detects format correctly
      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const inputName = `input.${ext}`;
      await ffmpeg.writeFile(inputName, await fetchFile(file));
      if (cancelledRef.current) { stopFakeProgress(); return; }

      setProgressMsg('Converting to GIF…');

      /*
       * Simple, reliable single-pass approach:
       *   fps filter → scale filter → output as GIF
       *
       * We deliberately avoid the two-pass palettegen/paletteuse filter graph
       * because it requires filtergraph support that is unreliable in WASM builds.
       * The single-pass approach works consistently across all FFmpeg WASM versions.
       */
      const args: string[] = [];

      // Seek before input for fast seeking (keyframe-accurate)
      if (startTime > 0) {
        args.push('-ss', String(startTime));
      }

      args.push('-i', inputName);

      // Duration limit
      if (duration > 0) {
        args.push('-t', String(duration));
      }

      // Build vf filter: fps + scale
      const scaleW = width > 0 ? width : 'iw';
      // -2 ensures height is divisible by 2; lanczos gives best downscale quality
      const vf = `fps=${fps},scale=${scaleW}:-2:flags=lanczos`;

      args.push(
        '-vf', vf,
        '-loop', '0',       // infinite loop GIF
        '-f', 'gif',
        'output.gif',
      );

      console.log('[mp4-to-gif] ffmpeg args:', args.join(' '));

      const exitCode = await ffmpeg.exec(args);
      if (cancelledRef.current) { stopFakeProgress(); return; }

      if (exitCode !== 0) {
        throw new Error(`FFmpeg exited with code ${exitCode}. Check that the video file is valid.`);
      }

      setProgressMsg('Reading output file…');

      // readFile returns FileData = string | Uint8Array — handle both
      const rawData = await ffmpeg.readFile('output.gif');
      const bytes = toUint8Array(rawData);

      if (bytes.length === 0) {
        throw new Error('FFmpeg produced an empty GIF. Try reducing the duration or lowering the FPS/width.');
      }

      // Verify GIF magic bytes: GIF87a or GIF89a
      const magic = String.fromCharCode(bytes[0], bytes[1], bytes[2]);
      if (magic !== 'GIF') {
        throw new Error(`Output is not a valid GIF (got magic: "${magic}"). Try a shorter clip or lower settings.`);
      }

      // Clean up virtual FS
      try { await ffmpeg.deleteFile(inputName); } catch {}
      try { await ffmpeg.deleteFile('output.gif'); } catch {}

      stopFakeProgress();

      const blob = new Blob([bytes], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      setGifBlob(blob);
      setGifUrl(url);
      setStatus('complete');
      setProgressMsg('');
    } catch (err) {
      stopFakeProgress();
      if (!cancelledRef.current) {
        const msg = err instanceof Error ? err.message : 'Conversion failed.';
        setError(msg);
        setStatus('error');
        setProgress(0);
      }
    }
  }, [file, startTime, duration, width, fps, gifUrl, loadFFmpeg, startFakeProgress, stopFakeProgress]);

  const handleCancel = useCallback(() => {
    cancelledRef.current = true;
    stopFakeProgress();
    setStatus('idle');
    setProgress(0);
    setProgressMsg('');
  }, [stopFakeProgress]);

  const handleDownload = useCallback(() => {
    if (!gifBlob || !file || !gifUrl) return;
    const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^\w\s-]/g, '_');
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = `${safeName}.gif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [gifBlob, gifUrl, file]);

  // ── Derived state ───────────────────────────────────────────────────────────

  const isProcessing = status === 'processing' || status === 'loading-ffmpeg';
  const maxDuration = videoDuration > 0 ? videoDuration : 300;
  const effectiveDuration = duration > 0 ? duration : (videoDuration > 0 ? videoDuration - startTime : 0);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6 text-left">

      {/* Upload */}
      {!file && (
        <FileUploader
          accept={[
            '.mp4', '.mov', '.avi', '.webm', '.mkv',
            'video/mp4', 'video/quicktime', 'video/x-msvideo',
            'video/webm', 'video/x-matroska', 'video/*',
          ]}
          multiple={false}
          maxFiles={1}
          onFilesSelected={handleFilesSelected}
          onError={setError}
          disabled={isProcessing}
          label="Upload Video"
          description="Drag and drop an MP4, MOV, WebM, AVI, or MKV file here, or click to browse."
        />
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700" role="alert">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Conversion failed</p>
            <p className="text-sm mt-0.5">{error}</p>
            {logs.length > 0 && (
              <details className="mt-2">
                <summary className="text-xs cursor-pointer text-red-500 hover:text-red-700">Show FFmpeg log</summary>
                <pre className="mt-1 text-xs bg-red-100 rounded p-2 overflow-auto max-h-32 whitespace-pre-wrap">
                  {logs.slice(-15).join('\n')}
                </pre>
              </details>
            )}
          </div>
        </div>
      )}

      {/* File info + video preview */}
      {file && videoUrl && (
        <Card variant="outlined" size="lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Film className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {formatBytes(file.size)}
                  {videoDuration > 0 && ` · ${formatTime(videoDuration)}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              disabled={isProcessing}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
              aria-label="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Hidden video for metadata */}
          <video
            ref={videoRef}
            src={videoUrl}
            onLoadedMetadata={handleVideoMetadata}
            className="hidden"
            preload="metadata"
          />

          {/* Video preview */}
          <video
            src={videoUrl}
            controls
            className="w-full rounded-xl bg-black max-h-64 object-contain"
            preload="metadata"
          />
        </Card>
      )}

      {/* Options */}
      {file && (
        <Card variant="outlined">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Conversion Options</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Start time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Start Time — <span className="font-mono text-purple-600">{formatTime(startTime)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={Math.max(0, maxDuration - 1)}
                step={1}
                value={startTime}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setStartTime(v);
                  if (duration > 0 && v + duration > maxDuration) {
                    setDuration(Math.max(1, maxDuration - v));
                  }
                }}
                disabled={isProcessing}
                className="w-full accent-purple-600"
              />
              <p className="text-xs text-gray-400 mt-1">Where the GIF starts</p>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Duration — <span className="font-mono text-purple-600">
                  {duration === 0 ? 'Full clip' : `${duration}s`}
                </span>
              </label>
              <input
                type="range"
                min={0}
                max={Math.max(1, maxDuration - startTime)}
                step={1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                disabled={isProcessing}
                className="w-full accent-purple-600"
              />
              <p className="text-xs text-gray-400 mt-1">0 = full remaining clip</p>
            </div>

            {/* Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Output Width — <span className="font-mono text-purple-600">{width > 0 ? `${width}px` : 'Original'}</span>
              </label>
              <select
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                disabled={isProcessing}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={0}>Original size</option>
                <option value={240}>240px (tiny)</option>
                <option value={320}>320px (small)</option>
                <option value={480}>480px (medium)</option>
                <option value={640}>640px (large)</option>
                <option value={800}>800px (extra large)</option>
              </select>
            </div>

            {/* FPS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Frame Rate — <span className="font-mono text-purple-600">{fps} FPS</span>
              </label>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                disabled={isProcessing}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={5}>5 FPS (smallest file)</option>
                <option value={10}>10 FPS (recommended)</option>
                <option value={15}>15 FPS (balanced)</option>
                <option value={20}>20 FPS (smooth)</option>
                <option value={24}>24 FPS (cinematic)</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          {videoDuration > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-700">
              Output: <strong>{effectiveDuration > 0 ? `${effectiveDuration}s` : 'full clip'}</strong> at{' '}
              <strong>{fps} FPS</strong>, width <strong>{width > 0 ? `${width}px` : 'original'}</strong>
              {effectiveDuration > 0 && (
                <> — approx. <strong>{Math.round(effectiveDuration * fps)} frames</strong></>
              )}
            </div>
          )}

          {/* Tip for large files */}
          <p className="mt-3 text-xs text-gray-400">
            💡 Tip: For faster conversion and smaller files, keep clips under 15 seconds and use 10 FPS.
          </p>
        </Card>
      )}

      {/* Progress */}
      {isProcessing && (
        <Card variant="outlined">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin flex-shrink-0" />
            <p className="text-sm font-medium text-gray-700">
              {status === 'loading-ffmpeg' ? 'Loading FFmpeg engine (first time only)…' : 'Converting to GIF…'}
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="h-2.5 bg-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-1.5">{progress}%</p>
          {progressMsg && (
            <p className="text-xs text-gray-400 mt-1 font-mono truncate">{progressMsg}</p>
          )}
          <button
            onClick={handleCancel}
            className="mt-3 text-xs text-red-500 hover:text-red-700 underline"
          >
            Cancel
          </button>
        </Card>
      )}

      {/* Convert button */}
      {file && !isProcessing && status !== 'complete' && (
        <Button
          variant="primary"
          size="lg"
          onClick={handleConvert}
          disabled={!file}
        >
          <Film className="w-4 h-4 mr-2" />
          Convert to GIF
        </Button>
      )}

      {/* Result */}
      {status === 'complete' && gifUrl && gifBlob && (
        <Card variant="outlined" size="lg">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h3 className="text-base font-semibold text-gray-900">GIF Ready!</h3>
            <span className="ml-auto text-xs text-gray-500 font-medium">{formatBytes(gifBlob.size)}</span>
          </div>

          {/* GIF preview */}
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center mb-4 min-h-[120px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifUrl}
              alt="Converted GIF preview"
              className="max-w-full max-h-80 object-contain"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download GIF
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                setStatus('idle');
                setGifBlob(null);
                if (gifUrl) URL.revokeObjectURL(gifUrl);
                setGifUrl(null);
                setError(null);
              }}
            >
              Convert Again
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Mp4ToGifTool;
