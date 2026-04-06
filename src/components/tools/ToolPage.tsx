'use client';

import { Tool, ToolContent, ToolCategory } from '@/types/tool';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { type Locale } from '@/lib/i18n/config';
import { ToolProvider } from '@/lib/contexts/ToolContext';

export interface ToolPageProps {
  tool: Tool;
  content: ToolContent;
  locale: string;
  children?: React.ReactNode;
  localizedRelatedTools?: Record<string, { title: string; description: string }>;
}

export function ToolPage({ tool, content, locale, children }: ToolPageProps) {
  const toolDisplayName = content.title || tool.id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <ToolProvider toolSlug={tool.slug} toolName={toolDisplayName}>
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]" data-testid="tool-page">
        <Header locale={locale as Locale} />

        <main id="main-content" className="flex-1" tabIndex={-1}>
          <section className="bg-[#f5f5f5] pt-14 pb-0">
            <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
              <ToolHeader tool={tool} content={content} />
              <section
                className="mt-6"
                data-testid="tool-page-interface"
                aria-label="Tool interface"
              >
                {children}
              </section>
            </div>
          </section>
        </main>

        <Footer locale={locale as Locale} />
      </div>
    </ToolProvider>
  );
}

interface ToolHeaderProps {
  tool: Tool;
  content: ToolContent;
}

function ToolHeader({ tool, content }: ToolHeaderProps) {
  const toolName = tool.id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <header className="text-center" data-testid="tool-page-header" itemScope itemType="https://schema.org/SoftwareApplication">
      <meta itemProp="applicationCategory" content="UtilitiesApplication" />
      <meta itemProp="operatingSystem" content="Web Browser" />
      <meta itemProp="offers" itemScope itemType="https://schema.org/Offer" content="" />
      <meta itemProp="price" content="0" />
      <meta itemProp="priceCurrency" content="USD" />
      <h1
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
        data-testid="tool-page-title"
        itemProp="name"
      >
        {content.title || toolName}
      </h1>
      <p
        className="text-base text-gray-500 max-w-xl mx-auto leading-relaxed"
        data-testid="tool-page-subtitle"
        itemProp="description"
      >
        {content.metaDescription}
      </p>
    </header>
  );
}

export default ToolPage;
