'use client';

import { useEffect } from 'react';

/**
 * Popunder ad — dynamically injects the ad script on the client.
 * The ad network handles frequency capping server-side.
 */
export function PopunderAd() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://pl29432373.profitablecpmratenetwork.com/f0/90/3d/f0903d91f415ccd146482a01822ec679.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      try { document.body.removeChild(script); } catch {}
    };
  }, []);

  return null;
}

export default PopunderAd;
