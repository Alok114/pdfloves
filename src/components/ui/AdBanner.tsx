'use client';

import { useEffect, useRef } from 'react';

export function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    const container = containerRef.current;
    if (!container) return;

    // Set atOptions on window
    (window as any).atOptions = {
      key: 'd63b4956e049568ab3f0caf1c93ed47b',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {},
    };

    // Create and append the invoke script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.highperformanceformat.com/d63b4956e049568ab3f0caf1c93ed47b/invoke.js';
    script.async = true;
    container.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center items-center py-6 w-full overflow-hidden">
      <div
        ref={containerRef}
        style={{ width: '728px', height: '90px', maxWidth: '100%' }}
        aria-label="Advertisement"
      />
    </div>
  );
}

export default AdBanner;
