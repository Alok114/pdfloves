'use client';

import { useEffect } from 'react';

// Module-level flag — survives React Strict Mode double-invoke
// but resets on full page reload (which is what we want)
let injected = false;

export function PopunderAd() {
  useEffect(() => {
    if (injected) return;
    injected = true;

    const script = document.createElement('script');
    script.src =
      'https://pl29432373.profitablecpmratenetwork.com/f0/90/3d/f0903d91f415ccd146482a01822ec679.js';
    script.type = 'text/javascript';
    // Do NOT use async — popunder scripts need synchronous execution
    // to attach their click listener before the page is interactive
    document.head.appendChild(script);
  }, []);

  return null;
}

export default PopunderAd;
