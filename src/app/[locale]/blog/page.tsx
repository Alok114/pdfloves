import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getAllPosts } from '@/lib/blog/posts';
import Link from 'next/link';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Blog | Pdfloves — PDF Tips, Guides & How-Tos',
  description:
    'Learn how to work smarter with PDFs. Step-by-step guides, tips, and tutorials for merging, compressing, converting, and editing PDF files.',
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header locale={locale as Locale} />

      <main className="flex-1 pt-14" id="main-content">
        {/* Hero */}
        <div className="bg-white border-b border-gray-200 py-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Blog</h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            Guides, tips, and how-tos for working with PDFs — all free, all in your browser.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">

          {/* Featured post */}
          {featured && (
            <div className="mb-12">
              <Link href={`/${locale}/blog/${featured.slug}`} className="group block">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
                  {/* Card thumbnail */}
                  <div
                    className="md:w-80 flex-shrink-0 flex items-center justify-center p-10 min-h-[200px]"
                    style={{ backgroundColor: featured.cardBg }}
                  >
                    <span
                      className="text-2xl font-bold leading-tight text-center"
                      style={{ color: featured.cardTextColor }}
                    >
                      {featured.cardLabel}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="p-8 flex flex-col justify-center">
                    <p className="text-xs text-gray-400 mb-2">{featured.date}</p>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[hsl(var(--color-primary))] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{featured.description}</p>
                    <span className="text-sm font-semibold text-[hsl(var(--color-primary))]">
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid of remaining posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((post) => (
              <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group block">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                  {/* Card thumbnail */}
                  <div
                    className="flex items-center justify-center p-8 min-h-[160px]"
                    style={{ backgroundColor: post.cardBg }}
                  >
                    <span
                      className="text-xl font-bold leading-tight text-center"
                      style={{ color: post.cardTextColor }}
                    >
                      {post.cardLabel}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs text-gray-400 mb-1">{post.date}</p>
                    <h2 className="text-base font-bold text-gray-900 mb-2 group-hover:text-[hsl(var(--color-primary))] transition-colors leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed flex-1">{post.description}</p>
                    <span className="mt-3 text-sm font-semibold text-[hsl(var(--color-primary))]">
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
