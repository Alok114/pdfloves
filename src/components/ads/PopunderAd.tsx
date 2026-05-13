'use client';

import { useEffect } from 'react';

/**
 * Popunder ad — dynamically injects the ad script on the client.
 * Uses sessionStorage to fire only once per browser session,
 * preventing the ad from re-triggering on every page navigation.
 */
export function PopunderAd() {
  useEffect(() => {
    // Only inject once per session
    if (sessionStorage.getItem('popunder_loaded')) return;
    sessionStorage.setItem('popunder_loaded', '1');

    const script = document.createElement('script');
    script.src =
      'https://pl29432373.profitablecpmratenetwork.com/f0/90/3d/f0903d91f415ccd146482a01822ec679.js';
    script.async = true;
    script.type = 'text/javascript';
    document.body.appendChild(script);
  }, []);

  return null;
}

export default PopunderAd;
