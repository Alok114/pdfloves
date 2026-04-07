'use client';

import { useEffect, useRef } from 'react';

export function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    injected.current = true;

    // Set ad options on window
    (window as any).atOptions = {
      key: '5af46c90d3e82e8de50040d0980efac4',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {},
    };

    // Inject invoke script
    const script = document.createElement('script');
    script.src = 'https://www.highperformanceformat.com/5af46c90d3e82e8de50040d0980efac4/invoke.js';
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center items-center py-4">
      <div
        ref={containerRef}
        style={{ width: 728, height: 90, maxWidth: '100%' }}
        aria-label="Advertisement"
      />
    </div>
  );
}

export default AdBanner;
