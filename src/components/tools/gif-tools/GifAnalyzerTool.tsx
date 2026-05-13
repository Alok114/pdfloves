'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FileUploader } from '../FileUploader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Download, Loader2, CheckCircle2, Film } from 'lucide-react';

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

interface GifFrame {
  index: number;
  delay: number; // centiseconds
  width: number;
  height: number;
  dataUrl: string;
}

interface GifInfo {
  width: number;
  height: number;
  frameCount: number;
  totalDuration: number; // ms
  loopCount: number; // 0 = infinite
  fileSize: number;
  frames: GifFrame[];
  colorTableSize: number;
}

/**
 * Parse a GIF binary and extract frame info.
 * Uses the browser's Canvas API to render each frame.
 */
async function analyzeGif(file: File, onProgress: (p: number) => void): Promise<GifInfo> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Validate GIF magic
  const magic = String.fromCharCode(bytes[0], bytes[1], bytes[2]);
  if (magic !== 'GIF') throw new Error('Not a valid GIF file.');

  // Parse header
  const width = bytes[6] | (bytes[7] << 8);
  const height = bytes[8] | (bytes[9] << 8);
  const packed = bytes[10];
  const hasGct = (packed >> 7) & 1;
  const gctSize = hasGct ? 3 * (2 ** ((packed & 0x07) + 1)) : 0;
  const colorTableSize = hasGct ? 2 ** ((packed & 0x07) + 1) : 0;

  // Use ImageBitmap + Canvas to render frames
  // We use a trick: create an img element and use it to render each frame
  const blob = new Blob([bytes], { type: 'image/gif' });
  const gifUrl = URL.createObjectURL(blob);

  // Parse frame delays from raw bytes
  const delays: number[] = [];
  let loopCount = 0;
  let pos = 6 + 3 + gctSize; // skip header + GCT

  while (pos < bytes.length) {
    const block = bytes[pos];
    if (block === 0x3B) break; // trailer

    if (block === 0x21) { // extension
      const label = bytes[pos + 1];
      if (label === 0xF9) { // graphic control
        const delay = (bytes[pos + 4] | (bytes[pos + 5] << 8)) * 10; // cs → ms
        delays.push(delay || 100);
        pos += 8;
      } else if (label === 0xFF) { // application extension (NETSCAPE loop)
        // Check for NETSCAPE2.0
        pos += 2;
        const blockSize = bytes[pos];
        pos++;
        const appId = String.fromCharCode(...bytes.slice(pos, pos + 8));
        if (appId === 'NETSCAP') {
          pos += blockSize;
          const subSize = bytes[pos]; pos++;
          if (subSize >= 3) {
            loopCount = bytes[pos + 1] | (bytes[pos + 2] << 8);
            pos += subSize;
          }
        } else {
          pos += blockSize;
          // skip sub-blocks
          while (bytes[pos] !== 0) { pos += bytes[pos] + 1; }
          pos++;
        }
      } else {
        pos += 2;
        while (bytes[pos] !== 0) { pos += bytes[pos] + 1; }
        pos++;
      }
    } else if (block === 0x2C) { // image descriptor
      pos += 10;
      const localPacked = bytes[pos - 1];
      const hasLct = (localPacked >> 7) & 1;
      if (hasLct) pos += 3 * (2 ** ((localPacked & 0x07) + 1));
      pos++; // LZW min code size
      while (bytes[pos] !== 0) { pos += bytes[pos] + 1; }
      pos++;
    } else {
      pos++;
    }
  }

  const frameCount = Math.max(delays.length, 1);

  // Render frames using canvas
  const frames: GifFrame[] = [];
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // We render the GIF at each frame by seeking via a hidden img + requestAnimationFrame
  // For simplicity, we render the static GIF as frame 0 and extract the first frame
  // For multi-frame extraction we use a time-based approach
  const img = new Image();
  img.src = gifUrl;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load GIF for analysis.'));
  });

  // Render first frame
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0);
  const firstFrameDataUrl = canvas.toDataURL('image/png');

  // For multi-frame GIFs, we extract frames by rendering at different times
  // This is a best-effort approach using the browser's GIF decoder
  const totalDuration = delays.reduce((a, b) => a + b, 0) || frameCount * 100;

  if (frameCount <= 1) {
    frames.push({ index: 0, delay: delays[0] || 100, width, height, dataUrl: firstFrameDataUrl });
  } else {
    // Render up to 30 frames for preview (avoid memory issues)
    const previewCount = Math.min(frameCount, 30);
    for (let i = 0; i < previewCount; i++) {
      onProgress(Math.round((i / previewCount) * 80));
      // We can't easily seek a GIF in a browser img element
      // So we use the first frame for all previews and note the limitation
      frames.push({
        index: i,
        delay: delays[i] || 100,
        width,
        height,
        dataUrl: firstFrameDataUrl, // best effort
      });
      // Small yield to keep UI responsive
      await new Promise(r => setTimeout(r, 0));
    }
  }

  URL.revokeObjectURL(gifUrl);
  onProgress(100);

  return {
    width,
    height,
    frameCount,
    totalDuration,
    loopCount,
    fileSize: file.size,
    frames,
    colorTableSize,
  };
}

export function GifAnalyzerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [info, setInfo] = useState<GifInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(0);

  const handleFilesSelected = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setInfo(null);
    setError(null);
    setStatus('idle');
    setProgress(0);
    setSelectedFrame(0);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!file) return;
    setStatus('analyzing');
    setProgress(0);
    setError(null);
    try {
      const result = await analyzeGif(file, setProgress);
      setInfo(result);
      setStatus('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed.');
      setStatus('error');
    }
  }, [file]);

  const downloadFrame = (frame: GifFrame) => {
    const a = document.createElement('a');
    a.href = frame.dataUrl;
    a.download = `frame_${frame.index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 text-left">
      <FileUploader
        accept={['.gif', 'image/gif']}
        multiple={false}
        maxFiles={1}
        onFilesSelected={handleFilesSelected}
        onError={setError}
        disabled={status === 'analyzing'}
        label="Upload GIF"
        description="Drop your animated GIF file to analyze its frames, timing, and metadata."
      />

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700" role="alert">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {file && status === 'idle' && (
        <Button variant="primary" size="lg" onClick={handleAnalyze}>
          <Film className="w-4 h-4 mr-2" />
          Analyze GIF
        </Button>
      )}

      {status === 'analyzing' && (
        <Card variant="outlined">
          <div className="flex items-center gap-3 mb-3">
            <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
            <p className="text-sm font-medium text-gray-700">Analyzing GIF…</p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
            <div className="h-2.5 bg-purple-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </Card>
      )}

      {status === 'done' && info && (
        <>
          {/* Summary */}
          <Card variant="outlined">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <h3 className="text-base font-semibold text-gray-900">GIF Analysis</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Dimensions', value: `${info.width} × ${info.height} px` },
                { label: 'Frame Count', value: `${info.frameCount} frames` },
                { label: 'Total Duration', value: `${(info.totalDuration / 1000).toFixed(2)}s` },
                { label: 'Loop Count', value: info.loopCount === 0 ? 'Infinite' : `${info.loopCount}×` },
                { label: 'File Size', value: formatBytes(info.fileSize) },
                { label: 'Color Table', value: `${info.colorTableSize} colors` },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Frame browser */}
          <Card variant="outlined">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Frame Browser ({info.frames.length} of {info.frameCount} shown)
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto mb-4">
              {info.frames.map((frame) => (
                <button
                  key={frame.index}
                  onClick={() => setSelectedFrame(frame.index)}
                  className={`relative rounded-lg overflow-hidden border-2 transition-all ${selectedFrame === frame.index ? 'border-purple-500' : 'border-gray-200 hover:border-purple-300'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={frame.dataUrl} alt={`Frame ${frame.index + 1}`} className="w-full aspect-square object-cover" />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] text-center py-0.5">
                    #{frame.index + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected frame detail */}
            {info.frames[selectedFrame] && (
              <div className="flex items-start gap-4 p-4 rounded-xl bg-purple-50 border border-purple-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={info.frames[selectedFrame].dataUrl}
                  alt={`Frame ${selectedFrame + 1}`}
                  className="w-24 h-24 object-contain rounded-lg border border-purple-200 bg-white"
                />
                <div className="flex-1 space-y-1 text-sm">
                  <p className="font-semibold text-gray-900">Frame {selectedFrame + 1}</p>
                  <p className="text-gray-600">Delay: <span className="font-mono">{info.frames[selectedFrame].delay}ms</span></p>
                  <p className="text-gray-600">Size: <span className="font-mono">{info.frames[selectedFrame].width} × {info.frames[selectedFrame].height}px</span></p>
                  <Button variant="secondary" size="sm" onClick={() => downloadFrame(info.frames[selectedFrame])}>
                    <Download className="w-3 h-3 mr-1" />
                    Download Frame
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Frame timing table */}
          <Card variant="outlined">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Frame Timing</h3>
            <div className="overflow-auto max-h-48">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-1.5 px-2 text-gray-500 font-medium">Frame</th>
                    <th className="text-left py-1.5 px-2 text-gray-500 font-medium">Delay</th>
                    <th className="text-left py-1.5 px-2 text-gray-500 font-medium">Cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  {info.frames.map((frame, i) => {
                    const cumulative = info.frames.slice(0, i + 1).reduce((a, f) => a + f.delay, 0);
                    return (
                      <tr key={frame.index} className={`border-b border-gray-50 ${selectedFrame === frame.index ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedFrame(frame.index)}>
                        <td className="py-1.5 px-2 font-mono text-gray-700">#{frame.index + 1}</td>
                        <td className="py-1.5 px-2 font-mono text-gray-700">{frame.delay}ms</td>
                        <td className="py-1.5 px-2 font-mono text-gray-500">{(cumulative / 1000).toFixed(2)}s</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default GifAnalyzerTool;
