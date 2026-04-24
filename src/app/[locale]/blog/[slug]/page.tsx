import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllPosts, getPostBySlug } from '@/lib/blog/posts';
import Link from 'next/link';

export function generateStaticParams() {
  const posts = getAllPosts();
  return locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | Pdfloves Blog`,
    description: post.description,
  };
}

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  // Parse simple markdown-like content into HTML sections
  const sections = post.content
    .trim()
    .split('\n')
    .map((line) => line.trimEnd());

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header locale={locale as Locale} />

      <main className="flex-1 pt-14" id="main-content">
        {/* Hero */}
        <div className="bg-white border-b border-gray-200 py-12 text-center px-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Link
                href={`/${locale}/blog`}
                className="text-xs font-semibold text-[hsl(var(--color-primary))] hover:underline"
              >
                Blog
              </Link>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs text-gray-400">{post.date}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">{post.description}</p>
          </div>
        </div>

        {/* Article body */}
        <div className="max-w-2xl mx-auto px-4 py-12">
          <article className="prose-custom">
            <BlogContent lines={sections} />
          </article>

          {/* Back link */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link
              href={`/${locale}/blog`}
              className="text-sm font-semibold text-[hsl(var(--color-primary))] hover:underline"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}

// Simple renderer for the markdown-like content stored in posts
function BlogContent({ lines }: { lines: string[] }) {
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc pl-6 space-y-1 text-gray-700 text-sm mb-4">
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={key++} className="text-xl font-bold text-gray-900 mt-8 mb-3">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3 key={key++} className="text-base font-bold text-gray-800 mt-6 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      listItems.push(line.replace('- ', ''));
    } else if (/^\d+\. /.test(line)) {
      flushList();
      // numbered list item — collect and render as ol
      const text = line.replace(/^\d+\. /, '');
      elements.push(
        <div key={key++} className="flex gap-2 text-sm text-gray-700 mb-1">
          <span className="font-semibold text-[hsl(var(--color-primary))] min-w-[1.2rem]">
            {line.match(/^(\d+)\./)?.[1]}.
          </span>
          <span dangerouslySetInnerHTML={{ __html: renderInline(text) }} />
        </div>
      );
    } else if (line.trim() === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p
          key={key++}
          className="text-sm text-gray-700 leading-relaxed mb-3"
          dangerouslySetInnerHTML={{ __html: renderInline(line) }}
        />
      );
    }
  }
  flushList();

  return <>{elements}</>;
}

// Render **bold** and `code` inline
function renderInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 rounded text-xs font-mono">$1</code>');
}
