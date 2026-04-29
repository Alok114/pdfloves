'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { setAdminAuthenticated } from '@/lib/supabase/auth';
import { useRouter } from 'next/navigation';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    setAdminAuthenticated(false);
    router.push('/admin/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin/blog" className="text-xl font-bold text-gray-900">
              PDFCraft Admin
            </Link>
            <div className="flex gap-4">
              <Link
                href="/admin/blog"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === '/admin/blog'
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Blog Posts
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              View Site →
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
