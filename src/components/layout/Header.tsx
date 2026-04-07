'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, Menu, X, ChevronDown, Globe, LayoutGrid, Heart } from 'lucide-react';
import { type Locale, locales, localeConfig, getLocalizedPath } from '@/lib/i18n/config';
import { Button } from '@/components/ui/Button';
import { RecentFilesDropdown } from '@/components/common/RecentFilesDropdown';
import { searchTools, SearchResult } from '@/lib/utils/search';
import { getToolContent } from '@/config/tool-content';
import { getAllTools } from '@/config/tools';
import { saveLanguagePreference } from './LanguageSelector';
import { ToolIcon } from '@/components/ui/ToolIcon';

export interface HeaderProps {
  locale: Locale;
  showSearch?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ locale, showSearch = true }) => {
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allToolsOpen, setAllToolsOpen] = useState(false);
  const [convertOpen, setConvertOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [localizedTools, setLocalizedTools] = useState<Record<string, { title: string; description: string }>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const allToolsRef = useRef<HTMLDivElement>(null);
  const convertRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Load localized tool content on mount
  useEffect(() => {
    const allTools = getAllTools();
    const contentMap: Record<string, { title: string; description: string }> = {};

    allTools.forEach(tool => {
      const content = getToolContent(locale, tool.id);
      if (content) {
        contentMap[tool.id] = {
          title: content.title,
          description: content.metaDescription
        };
      }
    });

    setLocalizedTools(contentMap);
  }, [locale]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (allToolsRef.current && !allToolsRef.current.contains(event.target as Node)) {
        setAllToolsOpen(false);
      }
      if (convertRef.current && !convertRef.current.contains(event.target as Node)) {
        setConvertOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    saveLanguagePreference(newLocale);
    const newPath = getLocalizedPath(pathname || '/', newLocale);
    router.push(newPath);
    setLangOpen(false);
  };

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const results = searchTools(searchQuery, localizedTools); // Pass localized content
      setSearchResults(results.slice(0, 8)); // Limit to 8 results
      setSelectedIndex(-1);
    } else {
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  }, [searchQuery, localizedTools]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        navigateToTool(searchResults[selectedIndex].tool.slug);
      } else if (searchResults.length > 0) {
        navigateToTool(searchResults[0].tool.slug);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [searchResults, selectedIndex]);

  const navigateToTool = useCallback((slug: string) => {
    router.push(`/${locale}/tools/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  }, [locale, router]);

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  // Get tool icon based on category
  const getToolIcon = (category: string) => {
    const icons: Record<string, string> = {
      'edit-annotate': '✏️',
      'convert-to-pdf': '📄',
      'convert-from-pdf': '🖼️',
      'organize-manage': '📁',
      'optimize-repair': '🔧',
      'secure-pdf': '🔒',
    };
    return icons[category] || '📄';
  };

  // iLovePDF-style nav items
  const quickNavItems = [
    { href: `/${locale}/tools/merge-pdf`, label: 'MERGE PDF' },
    { href: `/${locale}/tools/split-pdf`, label: 'SPLIT PDF' },
    { href: `/${locale}/tools/compress-pdf`, label: 'COMPRESS PDF' },
  ];

  const convertItems = [
    { href: `/${locale}/tools/word-to-pdf`, label: 'WORD to PDF' },
    { href: `/${locale}/tools/excel-to-pdf`, label: 'EXCEL to PDF' },
    { href: `/${locale}/tools/pptx-to-pdf`, label: 'POWERPOINT to PDF' },
    { href: `/${locale}/tools/pdf-to-docx`, label: 'PDF to WORD' },
    { href: `/${locale}/tools/pdf-to-excel`, label: 'PDF to EXCEL' },
    { href: `/${locale}/tools/pdf-to-pptx`, label: 'PDF to POWERPOINT' },
    { href: `/${locale}/tools/image-to-pdf`, label: 'JPG to PDF' },
    { href: `/${locale}/tools/pdf-to-jpg`, label: 'PDF to JPG' },
  ];

  const allToolCategories = [
    { label: 'ORGANIZE PDF', items: [
      { href: `/${locale}/tools/merge-pdf`, label: 'Merge PDF', toolId: 'merge-pdf' },
      { href: `/${locale}/tools/split-pdf`, label: 'Split PDF', toolId: 'split-pdf' },
      { href: `/${locale}/tools/delete-pages`, label: 'Remove pages', toolId: 'delete-pages' },
      { href: `/${locale}/tools/extract-pages`, label: 'Extract pages', toolId: 'extract-pages' },
      { href: `/${locale}/tools/organize-pdf`, label: 'Organize PDF', toolId: 'organize-pdf' },
    ]},
    { label: 'OPTIMIZE PDF', items: [
      { href: `/${locale}/tools/compress-pdf`, label: 'Compress PDF', toolId: 'compress-pdf' },
      { href: `/${locale}/tools/repair-pdf`, label: 'Repair PDF', toolId: 'repair-pdf' },
      { href: `/${locale}/tools/ocr-pdf`, label: 'OCR PDF', toolId: 'ocr-pdf' },
    ]},
    { label: 'CONVERT TO PDF', items: [
      { href: `/${locale}/tools/image-to-pdf`, label: 'JPG to PDF', toolId: 'jpg-to-pdf' },
      { href: `/${locale}/tools/word-to-pdf`, label: 'WORD to PDF', toolId: 'word-to-pdf' },
      { href: `/${locale}/tools/pptx-to-pdf`, label: 'POWERPOINT to PDF', toolId: 'pptx-to-pdf' },
      { href: `/${locale}/tools/excel-to-pdf`, label: 'EXCEL to PDF', toolId: 'excel-to-pdf' },
      { href: `/${locale}/tools/markdown-to-pdf`, label: 'HTML to PDF', toolId: 'markdown-to-pdf' },
    ]},
    { label: 'CONVERT FROM PDF', items: [
      { href: `/${locale}/tools/pdf-to-jpg`, label: 'PDF to JPG', toolId: 'pdf-to-jpg' },
      { href: `/${locale}/tools/pdf-to-docx`, label: 'PDF to WORD', toolId: 'pdf-to-docx' },
      { href: `/${locale}/tools/pdf-to-pptx`, label: 'PDF to POWERPOINT', toolId: 'pdf-to-pptx' },
      { href: `/${locale}/tools/pdf-to-excel`, label: 'PDF to EXCEL', toolId: 'pdf-to-excel' },
      { href: `/${locale}/tools/pdf-to-pdfa`, label: 'PDF to PDF/A', toolId: 'pdf-to-pdfa' },
    ]},
    { label: 'EDIT PDF', items: [
      { href: `/${locale}/tools/rotate-pdf`, label: 'Rotate PDF', toolId: 'rotate-pdf' },
      { href: `/${locale}/tools/page-numbers`, label: 'Add page numbers', toolId: 'page-numbers' },
      { href: `/${locale}/tools/add-watermark`, label: 'Add watermark', toolId: 'add-watermark' },
      { href: `/${locale}/tools/edit-pdf`, label: 'Edit PDF', toolId: 'edit-pdf' },
    ]},
    { label: 'PDF SECURITY', items: [
      { href: `/${locale}/tools/encrypt-pdf`, label: 'Unlock PDF', toolId: 'encrypt-pdf' },
      { href: `/${locale}/tools/decrypt-pdf`, label: 'Protect PDF', toolId: 'decrypt-pdf' },
      { href: `/${locale}/tools/sign-pdf`, label: 'Sign PDF', toolId: 'sign-pdf' },
      { href: `/${locale}/tools/find-and-redact`, label: 'Redact PDF', toolId: 'find-and-redact' },
    ]},
  ];

  const isActive = (href: string) => pathname?.startsWith(href) && href !== `/${locale}`;

  return (
    <header
      className="fixed top-0 z-50 w-full bg-white border-b border-gray-200"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="group flex items-center flex-shrink-0"
            aria-label="Pdfloves - Home"
          >
            <div className="flex items-center text-[1.82rem] font-black" data-testid="brand-name">
              <span className="text-gray-900">Pdf</span>
              <Heart className="h-[1.82rem] w-[1.82rem] mx-0.5 text-[hsl(var(--color-primary))] fill-current transition-transform group-hover:scale-110" />
              <span className="text-gray-900">loves</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center h-full" role="navigation" aria-label="Main navigation">
            {/* Quick nav items */}
            {quickNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 h-14 flex items-center text-xs font-bold tracking-wide transition-colors border-b-2 ${
                  isActive(item.href)
                    ? 'text-[hsl(var(--color-primary))] border-[hsl(var(--color-primary))]'
                    : 'text-gray-700 hover:text-[hsl(var(--color-primary))] border-transparent'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* CONVERT PDF dropdown */}
            <div className="relative" ref={convertRef} onMouseEnter={() => { setConvertOpen(true); setAllToolsOpen(false); }} onMouseLeave={() => setConvertOpen(false)}>
              <button
                onClick={() => { setConvertOpen(p => !p); setAllToolsOpen(false); }}
                className={`px-3 h-14 flex items-center gap-1 text-xs font-bold tracking-wide transition-colors border-b-2 ${
                  convertOpen ? 'text-[hsl(var(--color-primary))] border-[hsl(var(--color-primary))]' : 'text-gray-700 hover:text-[hsl(var(--color-primary))] border-transparent'
                }`}
                aria-expanded={convertOpen}
                aria-haspopup="true"
              >
                CONVERT PDF
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${convertOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {convertOpen && (
                <div className="absolute top-full left-0 mt-0 w-52 bg-white border border-gray-200 shadow-lg z-50 py-2">
                  {convertItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setConvertOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[hsl(var(--color-primary))] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ALL PDF TOOLS dropdown */}
            <div className="relative" ref={allToolsRef} onMouseEnter={() => { setAllToolsOpen(true); setConvertOpen(false); }} onMouseLeave={() => setAllToolsOpen(false)}>
              <button
                onClick={() => { setAllToolsOpen(p => !p); setConvertOpen(false); }}
                className={`px-3 h-14 flex items-center gap-1 text-xs font-bold tracking-wide transition-colors border-b-2 ${
                  allToolsOpen ? 'text-[hsl(var(--color-primary))] border-[hsl(var(--color-primary))]' : 'text-gray-700 hover:text-[hsl(var(--color-primary))] border-transparent'
                }`}
                aria-expanded={allToolsOpen}
                aria-haspopup="true"
              >
                ALL PDF TOOLS
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${allToolsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {allToolsOpen && (
                <div
                  className="fixed left-0 right-0 top-14 bg-white border-b border-gray-200 shadow-xl z-50 px-6 py-6"
                  onMouseLeave={() => setAllToolsOpen(false)}
                >
                  <div className="max-w-7xl mx-auto grid grid-cols-6 gap-6">
                    {allToolCategories.map((cat) => (
                      <div key={cat.label}>
                        <h3 className="text-xs font-bold text-gray-400 tracking-wider mb-3 uppercase">{cat.label}</h3>
                        <ul className="space-y-2">
                          {cat.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={() => setAllToolsOpen(false)}
                                className="flex items-center gap-2 text-sm text-gray-700 hover:text-[hsl(var(--color-primary))] transition-colors group/item"
                              >
                                <ToolIcon toolId={item.toolId} size={20} className="flex-shrink-0 rounded" />
                                <span>{item.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            {showSearch && (
              <div className="relative" ref={searchContainerRef}>
                {isSearchOpen ? (
                  <div className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-3 md:top-1/2 md:-translate-y-1/2 z-50 md:origin-right">
                    <div className="relative w-full md:w-80">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        ref={searchInputRef}
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search tools..."
                        className="w-full pl-9 pr-9 py-2 text-sm border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))] focus:border-transparent"
                        aria-label="Search tools"
                        autoComplete="off"
                      />
                      <button
                        onClick={handleSearchToggle}
                        aria-label="Close search"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                      {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl overflow-hidden max-h-[60vh] overflow-y-auto z-50">
                          <ul className="py-1" role="listbox">
                            {searchResults.map((result, index) => {
                              const localized = localizedTools[result.tool.id];
                              const toolName = localized?.title || result.tool.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                              return (
                                <li key={result.tool.id}>
                                  <button
                                    onClick={() => navigateToTool(result.tool.slug)}
                                    onMouseEnter={() => setSelectedIndex(index)}
                                    className={`w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors text-sm ${
                                      index === selectedIndex ? 'bg-gray-50 text-[hsl(var(--color-primary))]' : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    role="option"
                                    aria-selected={index === selectedIndex}
                                  >
                                    {toolName}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleSearchToggle}
                    aria-label="Open search"
                    className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <Search className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            {/* Recent Files */}
            <RecentFilesDropdown
              locale={locale}
              translations={{
                title: t('recentFiles.title') || 'Recent Files',
                empty: t('recentFiles.empty') || 'No recent files',
                clearAll: t('recentFiles.clearAll') || 'Clear all',
                processedWith: t('recentFiles.processedWith') || 'Processed with',
              }}
            />

            {/* Language Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(p => !p)}
                aria-label="Select language"
                className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
                aria-expanded={langOpen}
                aria-haspopup="true"
              >
                <Globe className="h-5 w-5" aria-hidden="true" />
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-1 w-44 bg-white border border-gray-200 shadow-lg z-50 py-1 max-h-72 overflow-y-auto">
                  {locales.map((loc) => {
                    const config = localeConfig[loc];
                    const isActive = loc === locale;
                    return (
                      <button
                        key={loc}
                        onClick={() => handleLanguageChange(loc)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? 'text-[hsl(var(--color-primary))] font-semibold bg-gray-50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[hsl(var(--color-primary))]'
                        }`}
                        aria-current={isActive ? 'true' : undefined}
                      >
                        {config.nativeName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grid / All tools icon */}
            <Link
              href={`/${locale}/tools`}
              aria-label="All tools"
              className="h-9 w-9 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors"
            >
              <LayoutGrid className="h-5 w-5" aria-hidden="true" />
            </Link>

            {/* Language Selector placeholder */}
            <div id="language-selector-slot" />

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden h-9 w-9 flex items-center justify-center text-gray-500"
              onClick={handleMobileMenuToggle}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav
            id="mobile-menu"
            className="md:hidden py-3 border-t border-gray-200 bg-white"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <ul className="flex flex-col">
              {quickNavItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[hsl(var(--color-primary))] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`/${locale}/tools`}
                  className="block px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[hsl(var(--color-primary))] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ALL PDF TOOLS
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
