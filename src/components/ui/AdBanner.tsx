'use client';

import { useEffect, useRef } from 'react';

let adScriptLoaded = false;

export function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const container = containerRef.current;
    if (!container) return;

    // Set atOptions on window for this banner instance
    (window as any).atOptions = {
      key: 'd63b4956e049568ab3f0caf1c93ed47b',
      format: 'iframe',
      height: 90,
      width: 728,
      params: {},
    };

    // Only load the invoke script once per page; subsequent banners
    // rely on the already-running ad script picking up atOptions.
    if (!adScriptLoaded) {
      adScriptLoaded = true;
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.highperformanceformat.com/d63b4956e049568ab3f0caf1c93ed47b/invoke.js';
      script.async = true;
      container.appendChild(script);
    } else {
      // Re-invoke for subsequent banner slots
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.highperformanceformat.com/d63b4956e049568ab3f0caf1c93ed47b/invoke.js';
      script.async = true;
      container.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center items-center py-4 w-full overflow-hidden">
      <div
        ref={containerRef}
        style={{ width: '728px', height: '90px', maxWidth: '100%' }}
        aria-label="Advertisement"
      />
    </div>
  );
}

export default AdBanner;
