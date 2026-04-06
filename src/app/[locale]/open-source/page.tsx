import { setRequestLocale } from 'next-intl/server';
import { locales, type Locale } from '@/lib/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'Open Source & Legal | Pdfloves',
  description: 'Open source attribution, license information, and legal notices for Pdfloves.',
};

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function OpenSourcePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header locale={locale as Locale} />

      <main className="flex-1 pt-14">
        <div className="max-w-3xl mx-auto px-4 py-12">

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Open Source &amp; Legal</h1>
          <p className="text-gray-500 mb-10 text-sm">
            Pdfloves is built on open-source software. This page provides full attribution and license information.
          </p>

          {/* Attribution */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">Attribution</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Pdfloves</span> is a modified version of{' '}
                <a
                  href="https://github.com/PDFCraftTool/pdfcraft"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--color-primary))] hover:underline font-medium"
                >
                  PDFCraft
                </a>
                , an open-source PDF toolkit.
              </p>
              <p>
                Original project: <a href="https://github.com/PDFCraftTool/pdfcraft" target="_blank" rel="noopener noreferrer" className="text-[hsl(var(--color-primary))] hover:underline">github.com/PDFCraftTool/pdfcraft</a>
              </p>
              <p>
                Original authors: PDFCraft Contributors
              </p>
              <p>
                Modifications by: <span className="font-semibold">Elaric AI LLC</span> — UI redesign, branding, and feature updates.
              </p>
            </div>
          </section>

          {/* License */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">License</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-5 text-sm text-gray-700 space-y-3">
              <p>
                This project is licensed under the{' '}
                <a
                  href="https://www.gnu.org/licenses/agpl-3.0.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--color-primary))] hover:underline font-medium"
                >
                  GNU Affero General Public License v3.0 (AGPL-3.0)
                </a>.
              </p>
              <p>
                Under AGPL-3.0, you are free to use, modify, and distribute this software, provided that:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>All modifications are released under the same AGPL-3.0 license.</li>
                <li>The source code of any modified version made available over a network must be disclosed.</li>
                <li>Copyright and license notices are preserved.</li>
              </ul>
              <p>
                Full license text:{' '}
                <a
                  href="https://www.gnu.org/licenses/agpl-3.0.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[hsl(var(--color-primary))] hover:underline"
                >
                  gnu.org/licenses/agpl-3.0.txt
                </a>
              </p>
            </div>
          </section>

          {/* Source Code */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">Source Code</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-5 text-sm text-gray-700 space-y-3">
              <p>
                In compliance with AGPL-3.0, the source code for Pdfloves (including all modifications) is available at:
              </p>
              <a
                href="https://github.com/PDFCraftTool/pdfcraft"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[hsl(var(--color-primary))] hover:underline font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                </svg>
                github.com/PDFCraftTool/pdfcraft
              </a>
            </div>
          </section>

          {/* Modifications */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-gray-800 mb-3 pb-2 border-b border-gray-200">Our Modifications</h2>
            <div className="bg-white rounded-lg border border-gray-200 p-5 text-sm text-gray-700">
              <p className="mb-3">The following changes were made to the original PDFCraft codebase by Elaric AI LLC:</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-600">
                <li>Complete UI redesign inspired by iLovePDF — new navbar, homepage layout, tool cards, and footer</li>
                <li>Rebranding from PDFCraft to Pdfloves</li>
                <li>Custom SVG tool icon system</li>
                <li>Language selector dropdown in header and footer</li>
                <li>Simplified tool pages — removed description, how-to, use cases, FAQ, and related tools sections</li>
                <li>Updated metadata, favicon, and site configuration</li>
              </ul>
            </div>
          </section>

          <div className="text-xs text-gray-400 pt-4 border-t border-gray-200">
            &copy; {new Date().getFullYear()} Elaric AI LLC. All rights reserved. Pdfloves is not affiliated with PDFCraft contributors.
          </div>
        </div>
      </main>

      <Footer locale={locale as Locale} />
    </div>
  );
}
