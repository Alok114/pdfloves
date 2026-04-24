'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Globe, ChevronDown } from 'lucide-react';
import { type Locale, locales, localeConfig, getLocalizedPath } from '@/lib/i18n/config';
import { saveLanguagePreference } from './LanguageSelector';

export interface FooterProps {
  locale: Locale;
}

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const t = useTranslations('common');
  const currentYear = new Date().getFullYear();
  const router = useRouter();
  const pathname = usePathname();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const footerLinks = [
    { href: `/${locale}/blog`, label: 'Blog' },
    { href: `/${locale}/about`, label: t('navigation.about') },
    { href: `/${locale}/faq`, label: t('navigation.faq') },
    { href: `/${locale}/privacy`, label: t('navigation.privacy') },
    { href: `/${locale}/contact`, label: t('navigation.contact') },
  ];

  const handleLanguageChange = (newLocale: Locale) => {
    saveLanguagePreference(newLocale);
    const newPath = getLocalizedPath(pathname, newLocale);
    router.push(newPath);
    setLangOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = localeConfig[locale]?.nativeName || 'English';

  return (
    <footer
      className="w-full bg-white border-t border-gray-200 py-4"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Copyright + Attribution */}
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Pdfloves&reg; &mdash; by <span className="font-medium">Elaric AI Pvt.Ltd.</span>
          </p>
          <p className="text-xs text-gray-400">
            Based on{' '}
            <a href="https://github.com/PDFCraftTool/pdfcraft" target="_blank" rel="noopener noreferrer" className="hover:text-[hsl(var(--color-primary))] underline underline-offset-2 transition-colors">PDFCraft</a>
            {' '}(AGPL-3.0) &mdash;{' '}
            <Link href={`/${locale}/open-source`} className="hover:text-[hsl(var(--color-primary))] underline underline-offset-2 transition-colors">
              Source Code &amp; License
            </Link>
          </p>
        </div>

        {/* Footer links */}
        <div className="flex items-center gap-4">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-gray-500 hover:text-[hsl(var(--color-primary))] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(p => !p)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[hsl(var(--color-primary))] transition-colors border border-gray-200 rounded px-2.5 py-1.5"
            aria-expanded={langOpen}
            aria-haspopup="listbox"
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{currentLang}</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {langOpen && (
            <div
              className="absolute bottom-full mb-1 right-0 w-44 bg-white border border-gray-200 shadow-lg z-50 py-1 max-h-60 overflow-y-auto"
              role="listbox"
            >
              {locales.map((loc) => {
                const config = localeConfig[loc];
                const isActive = loc === locale;
                return (
                  <button
                    key={loc}
                    onClick={() => handleLanguageChange(loc)}
                    role="option"
                    aria-selected={isActive}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      isActive
                        ? 'text-[hsl(var(--color-primary))] font-semibold bg-gray-50'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[hsl(var(--color-primary))]'
                    }`}
                  >
                    {config.nativeName}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

