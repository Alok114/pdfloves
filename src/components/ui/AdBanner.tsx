'use client';

import { useEffect, useRef } from 'react';

export function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const injected = useRef(false);

  useEffect(() => {
    if (injected.current || !containerRef.current) return;
    injected.current = true;

    const container = containerRef.current;

    // First script: set atOptions
    const optionsScript = document.createElement('script');
    optionsScript.type = 'text/javascript';
    optionsScript.text = `atOptions = {'key' : '5af46c90d3e82e8de50040d0980efac4','format' : 'iframe','height' : 90,'width' : 728,'params' : {}};`;
    container.appendChild(optionsScript);

    // Second script: invoke
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://www.highperformanceformat.com/5af46c90d3e82e8de50040d0980efac4/invoke.js';
    container.appendChild(invokeScript);
  }, []);

  return (
    <div className="flex justify-center items-center py-6">
      <div
        ref={containerRef}
        style={{ minWidth: 728, minHeight: 90, maxWidth: '100%' }}
        aria-label="Advertisement"
      />
    </div>
  );
}

export default AdBanner;
