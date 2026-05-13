'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { FileUploader } from '../FileUploader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Download, X, Film, AlertCircle, CheckCircle2, Loader2, GripVertical, Trash2 } from 'lucide-react';

type Status = 'idle' | 'loading-ffmpeg' | 'processing' | 'complete' | 'error';

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

function toUint8Array(data: unknown): Uint8Array<ArrayBuffer> {
  let buf: ArrayBuffer;
  if (data instanceof Uint8Array) {
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

interface FrameItem { id: string; file: File; previewUrl: string; }

export function GifMakerTool() {
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMsg, setProgressMsg] = useState('');
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Options
  const [frameDelay, setFrameDelay] = useState(100); // ms per frame
  const [width, setWidth] = useState(480);
  const [loop, setLoop] = useState(0); // 0 = infinite

  const ffmpegRef = useRef<FFmpeg | null>(null);
  const ffmpegLoadedRef = useRef(false);
  const cancelledRef = useRef(false);
  const fakeProgressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dragItem = useRef<number | null>(null);

  useEffect(() => () => {
    frames.forEach(f => URL.revokeObjectURL(f.previewUrl));
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    if (fakeProgressRef.current) clearInterval(fakeProgressRef.current);
  }, []); // eslint-disable-line

  const startFakeProgress = () => {
    setProgress(5);
    fakeProgressRef.current = setInterval(() => setProgress(p => p >= 90 ? (clearInterval(fakeProgressRef.current!), 90) : p + 3), 300);
  };
  const stopFakeProgress = () => {
    if (fakeProgressRef.current) { clearInterval(fakeProgressRef.current); fakeProgressRef.current = null; }
    setProgress(100);
  };

  const handleFilesSelected = useCallback((files: File[]) => {
    const newFrames: FrameItem[] = files.map(f => ({
      id: `${Date.now()}-${Math.random()}`,
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));
    setFrames(prev => [...prev, ...newFrames]);
    setError(null);
    setGifBlob(null);
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setGifUrl(null);
    setStatus('idle');
    setProgress(0);
  }, [gifUrl]);

  const removeFrame = (id: string) => {
    setFrames(prev => {
      const f = prev.find(x => x.id === id);
      if (f) URL.revokeObjectURL(f.previewUrl);
      return prev.filter(x => x.id !== id);
    });
  };

  const handleDragStart = (index: number) => { dragItem.current = index; };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === index) return;
    setFrames(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragItem.current!, 1);
      arr.splice(index, 0, moved);
      dragItem.current = index;
      return arr;
    });
  };

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

  const handleCreate = useCallback(async () => {
    if (frames.length < 2) { setError('Please add at least 2 images.'); return; }
    cancelledRef.current = false;
    setError(null);
    setGifBlob(null);
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setGifUrl(null);
    setProgress(0);

    try {
      const ffmpeg = await loadFFmpeg();
      if (cancelledRef.current) return;
      setStatus('processing');
      startFakeProgress();

      // Write all frames
      for (let i = 0; i < frames.length; i++) {
        const ext = frames[i].file.name.split('.').pop()?.toLowerCase() || 'png';
        await ffmpeg.writeFile(`frame${String(i).padStart(4, '0')}.${ext}`, await fetchFile(frames[i].file));
      }

      // Use concat demuxer for variable frame delays
      // Build concat file
      const concatLines: string[] = [];
      for (let i = 0; i < frames.length; i++) {
        const ext = frames[i].file.name.split('.').pop()?.toLowerCase() || 'png';
        concatLines.push(`file 'frame${String(i).padStart(4, '0')}.${ext}'`);
        concatLines.push(`duration ${(frameDelay / 1000).toFixed(3)}`);
      }
      // Add last frame again (required by concat demuxer)
      const lastExt = frames[frames.length - 1].file.name.split('.').pop()?.toLowerCase() || 'png';
      concatLines.push(`file 'frame${String(frames.length - 1).padStart(4, '0')}.${lastExt}'`);
      const concatContent = concatLines.join('\n');
      await ffmpeg.writeFile('concat.txt', new TextEncoder().encode(concatContent));

      const scaleW = width > 0 ? width : 'iw';
      const vf = `scale=${scaleW}:-2:flags=lanczos`;

      const args = [
        '-f', 'concat', '-safe', '0', '-i', 'concat.txt',
        '-vf', vf,
        '-loop', String(loop),
        '-f', 'gif',
        'output.gif',
      ];

      const code = await ffmpeg.exec(args);
      if (cancelledRef.current) { stopFakeProgress(); return; }
      if (code !== 0) throw new Error(`FFmpeg exited with code ${code}`);

      const raw = await ffmpeg.readFile('output.gif');
      const bytes = toUint8Array(raw);
      if (bytes.length === 0) throw new Error('Output GIF is empty. Try fewer frames or smaller images.');
      if (String.fromCharCode(bytes[0], bytes[1], bytes[2]) !== 'GIF') throw new Error('Output is not a valid GIF.');

      // Cleanup
      for (let i = 0; i < frames.length; i++) {
        const ext = frames[i].file.name.split('.').pop()?.toLowerCase() || 'png';
        try { await ffmpeg.deleteFile(`frame${String(i).padStart(4, '0')}.${ext}`); } catch {}
      }
      try { await ffmpeg.deleteFile('concat.txt'); } catch {}
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
        setError(err instanceof Error ? err.message : 'Failed to create GIF.');
        setStatus('error');
        setProgress(0);
      }
    }
  }, [frames, frameDelay, width, loop, gifUrl, loadFFmpeg]);

  const handleDownload = () => {
    if (!gifBlob || !gifUrl) return;
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = 'animated.gif';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isProcessing = status === 'processing' || status === 'loading-ffmpeg';

  return (
    <div className="space-y-6 text-left">
      <FileUploader
        accept={['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif', '.apng', '.avif', '.svg', 'image/*']}
        multiple
        maxFiles={200}
        onFilesSelected={handleFilesSelected}
        onError={setError}
        disabled={isProcessing}
        label="Upload Images"
        description="Upload JPG, PNG, WebP, BMP, GIF, APNG, AVIF, SVG — each image becomes one frame."
      />

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700" role="alert">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {frames.length > 0 && (
        <Card variant="outlined">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">{frames.length} frame{frames.length !== 1 ? 's' : ''} — drag to reorder</h3>
            <button onClick={() => { frames.forEach(f => URL.revokeObjectURL(f.previewUrl)); setFrames([]); }} className="text-xs text-red-500 hover:text-red-700">Clear all</button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto">
            {frames.map((frame, i) => (
              <div
                key={frame.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                className="relative group cursor-grab active:cursor-grabbing"
              >
                <img src={frame.previewUrl} alt={`Frame ${i + 1}`} className="w-full aspect-square object-cover rounded-lg border border-gray-200" />
                <span className="absolute top-0.5 left-0.5 bg-black/60 text-white text-[10px] px-1 rounded">{i + 1}</span>
                <button
                  onClick={() => removeFrame(frame.id)}
                  className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {frames.length > 0 && (
        <Card variant="outlined">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Options</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Frame Delay — <span className="font-mono text-purple-600">{frameDelay}ms</span>
              </label>
              <input type="range" min={20} max={2000} step={10} value={frameDelay}
                onChange={e => setFrameDelay(Number(e.target.value))} disabled={isProcessing}
                className="w-full accent-purple-600" />
              <div className="flex justify-between text-xs text-gray-400 mt-1"><span>Fast</span><span>Slow</span></div>
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Loop</label>
              <select value={loop} onChange={e => setLoop(Number(e.target.value))} disabled={isProcessing}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                <option value={0}>Infinite loop</option>
                <option value={1}>Play once</option>
                <option value={2}>2 times</option>
                <option value={3}>3 times</option>
              </select>
            </div>
          </div>
          <div className="mt-3 p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs text-purple-700">
            {frames.length} frames × {frameDelay}ms = <strong>{((frames.length * frameDelay) / 1000).toFixed(1)}s</strong> total duration
          </div>
        </Card>
      )}

      {isProcessing && (
        <Card variant="outlined">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
            <p className="text-sm font-medium text-gray-700">{status === 'loading-ffmpeg' ? 'Loading FFmpeg…' : 'Creating GIF…'}</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="h-2.5 bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{progress}%</p>
          <button onClick={() => { cancelledRef.current = true; stopFakeProgress(); setStatus('idle'); }} className="mt-2 text-xs text-red-500 hover:text-red-700 underline">Cancel</button>
        </Card>
      )}

      {frames.length >= 2 && !isProcessing && (
        <Button variant="primary" size="lg" onClick={handleCreate}>
          <Film className="w-4 h-4 mr-2" />
          Create GIF ({frames.length} frames)
        </Button>
      )}

      {status === 'complete' && gifUrl && gifBlob && (
        <Card variant="outlined" size="lg">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h3 className="text-base font-semibold text-gray-900">GIF Ready!</h3>
            <span className="ml-auto text-xs text-gray-500">{formatBytes(gifBlob.size)}</span>
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={gifUrl} alt="Animated GIF preview" className="max-w-full max-h-80 object-contain" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />Download GIF
            </Button>
            <Button variant="secondary" size="lg" onClick={() => { setStatus('idle'); setGifBlob(null); if (gifUrl) URL.revokeObjectURL(gifUrl); setGifUrl(null); }}>
              Create Another
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

export default GifMakerTool;
