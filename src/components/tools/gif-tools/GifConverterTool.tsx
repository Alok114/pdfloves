'use client';

/**
 * Shared converter component for all GIF conversion tools:
 *  - video-to-gif  (mp4/mov/webm/avi → gif)
 *  - gif-to-mp4    (gif → mp4)
 *  - gif-to-mkv    (gif → mkv)
 *  - gif-to-mov    (gif → mov)
 *  - webp-to-gif   (webp → gif)
 *  - apng-to-gif   (apng/png → gif)
 *  - avif-to-gif   (avif → gif)
 *  - jxl-to-gif    (jxl → gif)
 *  - svg-to-gif    (svg → gif)
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { FileUploader } from '../FileUploader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Download, X, Film, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

type Status = 'idle' | 'loading-ffmpeg' | 'processing' | 'complete' | 'error';

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function toUint8Array(data: unknown): Uint8Array<ArrayBuffer> {
  let buf: ArrayBuffer;
  if (data instanceof Uint8Array) {
    // Copy into a plain ArrayBuffer to satisfy strict TS lib types
    buf = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
  } else if (data instanceof ArrayBuffer) {
    buf = data;
  } else if (typeof data === 'string') {
    buf = new TextEncoder().encode(data).buffer as ArrayBuffer;
  } else {
    throw new Error('Unexpected data type');
  }
  return new Uint8Array(buf);
}

export type ConversionMode =
  | 'video-to-gif'
  | 'gif-to-mp4'
  | 'gif-to-mkv'
  | 'gif-to-mov'
  | 'webp-to-gif'
  | 'apng-to-gif'
  | 'avif-to-gif'
  | 'jxl-to-gif'
  | 'svg-to-gif';

interface ModeConfig {
  accept: string[];
  inputLabel: string;
  inputDesc: string;
  outputExt: string;
  outputMime: string;
  showFps: boolean;
  showTrim: boolean;
  showWidth: boolean;
  buildArgs: (inputName: string, outputName: string, opts: ConvertOpts) => string[];
}

interface ConvertOpts {
  startTime: number;
  duration: number;
  width: number;
  fps: number;
}

const MODE_CONFIG: Record<ConversionMode, ModeConfig> = {
  'video-to-gif': {
    accept: ['.mp4', '.mov', '.avi', '.webm', '.mkv', 'video/*'],
    inputLabel: 'Upload Video',
    inputDesc: 'Drop an MP4, MOV, WebM, AVI, or MKV file.',
    outputExt: 'gif',
    outputMime: 'image/gif',
    showFps: true,
    showTrim: true,
    showWidth: true,
    buildArgs: (inp, out, { startTime, duration, width, fps }) => {
      const args: string[] = [];
      if (startTime > 0) args.push('-ss', String(startTime));
      args.push('-i', inp);
      if (duration > 0) args.push('-t', String(duration));
      const scaleW = width > 0 ? width : 'iw';
      args.push('-vf', `fps=${fps},scale=${scaleW}:-2:flags=lanczos`, '-loop', '0', '-f', 'gif', out);
      return args;
    },
  },
  'gif-to-mp4': {
    accept: ['.gif', 'image/gif'],
    inputLabel: 'Upload GIF',
    inputDesc: 'Drop your animated GIF file.',
    outputExt: 'mp4',
    outputMime: 'video/mp4',
    showFps: false,
    showTrim: false,
    showWidth: true,
    buildArgs: (inp, out, { width }) => {
      const scaleW = width > 0 ? width : 'iw';
      return ['-i', inp, '-vf', `scale=${scaleW}:-2:flags=lanczos`, '-c:v', 'libx264', '-movflags', '+faststart', '-pix_fmt', 'yuv420p', '-f', 'mp4', out];
    },
  },
  // gif-to-mkv: standard @ffmpeg/core does not ship VP9/libvpx.
  // We output MKV (Matroska) with H.264 — same quality, universally playable.
  'gif-to-mkv': {
    accept: ['.gif', 'image/gif'],
    inputLabel: 'Upload GIF',
    inputDesc: 'Drop your animated GIF file.',
    outputExt: 'mkv',
    outputMime: 'video/x-matroska',
    showFps: false,
    showTrim: false,
    showWidth: true,
    buildArgs: (inp, out, { width }) => {
      const scaleW = width > 0 ? width : 'iw';
      return ['-i', inp, '-vf', `scale=${scaleW}:-2:flags=lanczos`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-f', 'matroska', out];
    },
  },
  'gif-to-mov': {
    accept: ['.gif', 'image/gif'],
    inputLabel: 'Upload GIF',
    inputDesc: 'Drop your animated GIF file.',
    outputExt: 'mov',
    outputMime: 'video/quicktime',
    showFps: false,
    showTrim: false,
    showWidth: true,
    buildArgs: (inp, out, { width }) => {
      const scaleW = width > 0 ? width : 'iw';
      return ['-i', inp, '-vf', `scale=${scaleW}:-2:flags=lanczos`, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-f', 'mov', out];
    },
  },
  'webp-to-gif': {
    accept: ['.webp', 'image/webp'],
    inputLabel: 'Upload WebP',
    inputDesc: 'Drop your animated WebP file.',
    outputExt: 'gif',
    outputMime: 'image/gif',
    showFps: false,
    showTrim: false,
    showWidth: true,
    buildArgs: (inp, out, { width }) => {
      const scaleW = width > 0 ? width : 'iw';
      return ['-i', inp, '-vf', `scale=${scaleW}:-2:flags=lanczos`, '-loop', '0', '-f', 'gif', out];
    },
  },
  'apng-to-gif': {
    accept: ['.apng', '.png', 'image/apng', 'image/png'],
    inputLabel: 'Upload APNG',
    inputDesc: 'Drop your animated PNG (APNG) file.',
    outputExt: 'gif',
    outputMime: 'image/gif',
    showFps: false,
    showTrim: false,
    showWidth: true,
    buildArgs: (inp, out, { width }) => {
      const scaleW = width > 0 ? width : 'iw';
      return ['-i', inp, '-vf', `scale=${scaleW}:-2:flags=lanczos`, '-loop', '0', '-f', 'gif', out];
    },
  },
  'avif-to-gif': {
    accept: ['.avif', 'image/avif'],
    inputLabel: 'Upload AVIF',
    inputDesc: 'Drop your animated AVIF file.',
    outputExt: 'gif',
    outputMime: 'image/gif',
    showFps: false,
    showTrim: false,
    showWidth: true,
    buildArgs: (inp, out, { width }) => {
      const scaleW = width > 0 ? width : 'iw';
      return ['-i', inp, '-vf', `scale=${scaleW}:-2:flags=lanczos`, '-loop', '0', '-f', 'gif', out];
    },
  },
  'jxl-to-gif': {
    accept: ['.jxl', 'image/jxl'],
    inputLabel: 'Upload JXL',
    inputDesc: 'Drop your animated JPEG XL (JXL) file.',
    outputExt: 'gif',
    outputMime: 'image/gif',
    showFps: false,
    showTrim: false,
    showWidth: true,
    buildArgs: (inp, out, { width }) => {
      const scaleW = width > 0 ? width : 'iw';
      return ['-i', inp, '-vf', `scale=${scaleW}:-2:flags=lanczos`, '-loop', '0', '-f', 'gif', out];
    },
  },
  'svg-to-gif': {
    accept: ['.svg', 'image/svg+xml'],
    inputLabel: 'Upload SVG',
    inputDesc: 'Drop your animated SVG file.',
    outputExt: 'gif',
    outputMime: 'image/gif',
    showFps: true,
    showTrim: false,
    showWidth: true,
    buildArgs: (inp, out, { width, fps }) => {
      const scaleW = width > 0 ? width : 'iw';
      return ['-i', inp, '-vf', `fps=${fps},scale=${scaleW}:-2:flags=lanczos`, '-loop', '0', '-f', 'gif', out];
    },
  },
};

interface Props { mode: ConversionMode; }

export function GifConverterTool({ mode }: Props) {
  const cfg = MODE_CONFIG[mode];

  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [width, setWidth] = useState(480);
  const [fps, setFps] = useState(10);

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const ffmpegLoadedRef = useRef(false);
  const cancelledRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fakeProgressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    if (fakeProgressRef.current) clearInterval(fakeProgressRef.current);
  }, []); // eslint-disable-line

  const startFakeProgress = () => {
    setProgress(5);
    fakeProgressRef.current = setInterval(() => setProgress(p => p >= 90 ? (clearInterval(fakeProgressRef.current!), 90) : p + 2), 400);
  };
  const stopFakeProgress = () => {
    if (fakeProgressRef.current) { clearInterval(fakeProgressRef.current); fakeProgressRef.current = null; }
    setProgress(100);
  };

  const handleFilesSelected = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(f);
    setVideoUrl(URL.createObjectURL(f));
    setOutputBlob(null); setOutputUrl(null);
    setError(null); setStatus('idle'); setProgress(0);
    setStartTime(0); setDuration(0);
  }, [videoUrl, outputUrl]);

  const handleRemove = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setFile(null); setVideoUrl(null); setOutputBlob(null); setOutputUrl(null);
    setError(null); setStatus('idle'); setProgress(0);
  }, [videoUrl, outputUrl]);

  const handleVideoMetadata = useCallback(() => {
    const dur = videoRef.current?.duration ?? 0;
    setVideoDuration(isFinite(dur) ? Math.floor(dur) : 0);
  }, []);

  const loadFFmpeg = useCallback(async (): Promise<FFmpeg> => {
    if (ffmpegRef.current && ffmpegLoadedRef.current) return ffmpegRef.current;
    const ffmpeg = new FFmpeg();
    ffmpegRef.current = ffmpeg;
    ffmpeg.on('log', ({ message }) => { if (message) setProgressMsg(message.slice(0, 100)); });
    setStatus('loading-ffmpeg');
    setProgressMsg('Loading FFmpeg…');
    const base = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    ffmpegLoadedRef.current = true;
    return ffmpeg;
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    cancelledRef.current = false;
    setError(null);
    setOutputBlob(null);
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setOutputUrl(null);
    setProgress(0);

    try {
      const ffmpeg = await loadFFmpeg();
      if (cancelledRef.current) return;
      setStatus('processing');
      startFakeProgress();

      const ext = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const inputName = `input.${ext}`;
      const outputName = `output.${cfg.outputExt}`;

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      if (cancelledRef.current) { stopFakeProgress(); return; }

      const args = cfg.buildArgs(inputName, outputName, { startTime, duration, width, fps });
      console.log('[gif-converter] args:', args.join(' '));

      const code = await ffmpeg.exec(args);
      if (cancelledRef.current) { stopFakeProgress(); return; }
      if (code !== 0) throw new Error(`FFmpeg exited with code ${code}. Check the file is valid.`);

      const raw = await ffmpeg.readFile(outputName);
      const bytes = toUint8Array(raw);
      if (bytes.length === 0) throw new Error('Output file is empty. Try different settings.');

      try { await ffmpeg.deleteFile(inputName); } catch {}
      try { await ffmpeg.deleteFile(outputName); } catch {}

      stopFakeProgress();
      const blob = new Blob([bytes], { type: cfg.outputMime });
      const url = URL.createObjectURL(blob);
      setOutputBlob(blob);
      setOutputUrl(url);
      setStatus('complete');
      setProgressMsg('');
    } catch (err) {
      stopFakeProgress();
      if (!cancelledRef.current) {
        setError(err instanceof Error ? err.message : 'Conversion failed.');
        setStatus('error');
        setProgress(0);
      }
    }
  }, [file, startTime, duration, width, fps, outputUrl, cfg, loadFFmpeg]);

  const handleDownload = () => {
    if (!outputBlob || !outputUrl || !file) return;
    const safeName = file.name.replace(/\.[^.]+$/, '').replace(/[^\w\s-]/g, '_');
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `${safeName}.${cfg.outputExt}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isProcessing = status === 'processing' || status === 'loading-ffmpeg';
  const isVideo = cfg.showTrim;
  const maxDur = videoDuration > 0 ? videoDuration : 300;
  const isGifOutput = cfg.outputExt === 'gif';

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="space-y-6 text-left">
      {!file && (
        <FileUploader
          accept={cfg.accept}
          multiple={false}
          maxFiles={1}
          onFilesSelected={handleFilesSelected}
          onError={setError}
          disabled={isProcessing}
          label={cfg.inputLabel}
          description={cfg.inputDesc}
        />
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700" role="alert">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {file && videoUrl && (
        <Card variant="outlined" size="lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                <Film className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-gray-500">{formatBytes(file.size)}{videoDuration > 0 ? ` · ${formatTime(videoDuration)}` : ''}</p>
              </div>
            </div>
            <button onClick={handleRemove} disabled={isProcessing} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-40">
              <X className="w-4 h-4" />
            </button>
          </div>
          {isVideo && (
            <>
              <video ref={videoRef} src={videoUrl} onLoadedMetadata={handleVideoMetadata} className="hidden" preload="metadata" />
              <video src={videoUrl} controls className="w-full rounded-xl bg-black max-h-56 object-contain" preload="metadata" />
            </>
          )}
          {isGifOutput && !isVideo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={videoUrl} alt="Input preview" className="max-w-full max-h-56 object-contain rounded-xl border border-gray-200 mx-auto block" />
          )}
        </Card>
      )}

      {file && (
        <Card variant="outlined">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cfg.showTrim && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Start — <span className="font-mono text-purple-600">{formatTime(startTime)}</span></label>
                  <input type="range" min={0} max={Math.max(0, maxDur - 1)} step={1} value={startTime}
                    onChange={e => { const v = Number(e.target.value); setStartTime(v); if (duration > 0 && v + duration > maxDur) setDuration(Math.max(1, maxDur - v)); }}
                    disabled={isProcessing} className="w-full accent-purple-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Duration — <span className="font-mono text-purple-600">{duration === 0 ? 'Full' : `${duration}s`}</span></label>
                  <input type="range" min={0} max={Math.max(1, maxDur - startTime)} step={1} value={duration}
                    onChange={e => setDuration(Number(e.target.value))} disabled={isProcessing} className="w-full accent-purple-600" />
                </div>
              </>
            )}
            {cfg.showWidth && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Output Width</label>
                <select value={width} onChange={e => setWidth(Number(e.target.value))} disabled={isProcessing}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value={0}>Original</option>
                  <option value={240}>240px</option>
                  <option value={320}>320px</option>
                  <option value={480}>480px</option>
                  <option value={640}>640px</option>
                </select>
              </div>
            )}
            {cfg.showFps && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Frame Rate — <span className="font-mono text-purple-600">{fps} FPS</span></label>
                <select value={fps} onChange={e => setFps(Number(e.target.value))} disabled={isProcessing}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value={5}>5 FPS</option>
                  <option value={10}>10 FPS (recommended)</option>
                  <option value={15}>15 FPS</option>
                  <option value={20}>20 FPS</option>
                  <option value={24}>24 FPS</option>
                </select>
              </div>
            )}
          </div>
        </Card>
      )}

      {isProcessing && (
        <Card variant="outlined">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
            <p className="text-sm font-medium text-gray-700">{status === 'loading-ffmpeg' ? 'Loading FFmpeg…' : 'Converting…'}</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="h-2.5 bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{progress}%</p>
          {progressMsg && <p className="text-xs text-gray-400 mt-1 font-mono truncate">{progressMsg}</p>}
          <button onClick={() => { cancelledRef.current = true; stopFakeProgress(); setStatus('idle'); }} className="mt-2 text-xs text-red-500 hover:text-red-700 underline">Cancel</button>
        </Card>
      )}

      {file && !isProcessing && status !== 'complete' && (
        <Button variant="primary" size="lg" onClick={handleConvert} disabled={!file}>
          <Film className="w-4 h-4 mr-2" />
          Convert to {cfg.outputExt.toUpperCase()}
        </Button>
      )}

      {status === 'complete' && outputUrl && outputBlob && (
        <Card variant="outlined" size="lg">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h3 className="text-base font-semibold text-gray-900">Done!</h3>
            <span className="ml-auto text-xs text-gray-500">{formatBytes(outputBlob.size)}</span>
          </div>
          {isGifOutput ? (
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={outputUrl} alt="Output preview" className="max-w-full max-h-72 object-contain" />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-black mb-4">
              <video src={outputUrl} controls className="w-full max-h-64 object-contain" />
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />Download {cfg.outputExt.toUpperCase()}
            </Button>
            <Button variant="secondary" size="lg" onClick={() => { setStatus('idle'); setOutputBlob(null); if (outputUrl) URL.revokeObjectURL(outputUrl); setOutputUrl(null); setError(null); }}>
              Convert Again
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default GifConverterTool;
