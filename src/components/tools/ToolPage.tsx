'use client';

import { Tool, ToolContent, ToolCategory } from '@/types/tool';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { type Locale } from '@/lib/i18n/config';
import { ToolProvider } from '@/lib/contexts/ToolContext';
import { AdBanner } from '@/components/ui/AdBanner';

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

              {/* Ad Banner */}
              <AdBanner />
            </div>
          </section>

          {/* SEO Content Section */}
          <ToolSeoContent content={content} />
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

interface ToolSeoContentProps {
  content: ToolContent;
}

function ToolSeoContent({ content }: ToolSeoContentProps) {
  const hasHowTo = content.howToUse && content.howToUse.length > 0;
  const hasFaq = content.faq && content.faq.length > 0;
  const hasDescription = content.description && content.description.trim().length > 0;

  if (!hasHowTo && !hasFaq && !hasDescription) return null;

  return (
    <section className="bg-white border-t border-gray-100 py-14" aria-label="About this tool">
      <div className="max-w-3xl mx-auto px-4 space-y-12">

        {/* How to Use */}
        {hasHowTo && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              How to Use {content.title}
            </h2>
            <ol className="space-y-4" aria-label="Steps">
              {content.howToUse.map((step) => (
                <li key={step.step} className="flex gap-4 items-start">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-sm flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {step.step}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800">{step.title}</p>
                    <p className="text-gray-500 text-sm mt-0.5">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* About / Why use this tool */}
        {hasDescription && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About {content.title}</h2>
            <div
              className="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
          </div>
        )}

        {/* FAQ */}
        {hasFaq && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <dl className="space-y-6">
              {content.faq.map((item, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <dt className="font-semibold text-gray-800 mb-2">{item.question}</dt>
                  <dd className="text-gray-500 text-sm leading-relaxed">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}

export default ToolPage;
