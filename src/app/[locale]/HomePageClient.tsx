'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { getAllTools, getToolsByCategory } from '@/config/tools';
import { type Locale } from '@/lib/i18n/config';
import { type ToolCategory } from '@/types/tool';
import { useState } from 'react';

interface HomePageClientProps {
  locale: Locale;
  localizedToolContent?: Record<string, { title: string; description: string }>;
}

const categoryTabs: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All tools' },
  { id: 'organize-manage', label: 'Organize PDF' },
  { id: 'optimize-repair', label: 'Optimize PDF' },
  { id: 'convert-to-pdf', label: 'Convert to PDF' },
  { id: 'convert-from-pdf', label: 'Convert from PDF' },
  { id: 'edit-annotate', label: 'Edit PDF' },
  { id: 'secure-pdf', label: 'PDF Security' },
];

export default function HomePageClient({ locale, localizedToolContent }: HomePageClientProps) {
  const allTools = getAllTools();
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');

  const displayedTools = activeCategory === 'all'
    ? allTools
    : getToolsByCategory(activeCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header locale={locale} />

      <main id="main-content" className="flex-1 pt-14" tabIndex={-1}>
        {/* Hero */}
        <section className="bg-[#f5f5f5] pt-10 pb-8 text-center px-4" aria-labelledby="hero-title">
          <h1
            id="hero-title"
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight"
          >
            All your PDF tools,{' '}
            <span className="text-[hsl(var(--color-primary))]">free & in one place</span>
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Merge, split, compress, convert and edit PDFs — all in your browser.
            No uploads, no sign-up, 100% private.
          </p>
        </section>

        {/* Category Tabs */}
        <section className="bg-white border-b border-gray-200 sticky top-14 z-40">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`flex-shrink-0 px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeCategory === tab.id
                      ? 'border-[hsl(var(--color-primary))] text-[hsl(var(--color-primary))]'
                      : 'border-transparent text-gray-600 hover:text-[hsl(var(--color-primary))]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Tools Grid */}
        <section className="py-8" aria-label="PDF Tools">
          <div className="max-w-7xl mx-auto px-4">
            <ToolGrid
              tools={displayedTools}
              locale={locale}
              localizedToolContent={localizedToolContent}
              className="gap-4"
            />
          </div>
        </section>
      </main>

      <Footer locale={locale} />
    </div>
  );
}
