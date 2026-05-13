/**
 * SkipLink Component
 * Requirements: 9.2
 * 
 * Provides a skip link for keyboard users to bypass navigation
 * and jump directly to main content.
 * Rendered only on client to avoid SSR/hydration mismatch.
 */

'use client';

import React, { useEffect, useState } from 'react';

export interface SkipLinkProps {
  targetId?: string;
  children: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  children,
}) => {
  // Only render on client to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const target = document.getElementById(targetId);
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <a
      href={`#${targetId}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="
        sr-only focus:not-sr-only
        fixed top-4 left-4 z-[10001]
        px-4 py-2
        bg-[hsl(var(--color-primary))] text-[hsl(var(--color-primary-foreground))]
        font-medium rounded-[var(--radius-md)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--color-ring))] focus-visible:ring-offset-2
        transition-all duration-[var(--transition-fast)]
      "
    >
      {children}
    </a>
  );
};

export default SkipLink;
