'use client';

import Script from 'next/script';

export function AdBanner() {
  return (
    <div className="flex justify-center items-center py-4">
      <div style={{ width: 728, height: 90, maxWidth: '100%' }} aria-label="Advertisement">
        <Script id="ad-options" strategy="afterInteractive">
          {`atOptions = {'key' : '5af46c90d3e82e8de50040d0980efac4','format' : 'iframe','height' : 90,'width' : 728,'params' : {}};`}
        </Script>
        <Script
          src="https://www.highperformanceformat.com/5af46c90d3e82e8de50040d0980efac4/invoke.js"
          strategy="afterInteractive"
        />
      </div>
    </div>
  );
}

export default AdBanner;
