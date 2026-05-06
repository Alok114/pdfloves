import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const response = intlMiddleware(request);
    const pathname = request.nextUrl.pathname;

    // Required for SharedArrayBuffer (LibreOffice WASM) — only on tool pages
    // Use 'credentialless' instead of 'require-corp' so third-party scripts
    // (like Adsterra) are not blocked while SharedArrayBuffer still works
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    if (pathname.includes('/tools/')) {
        // Tool pages need COEP for LibreOffice WASM
        // 'credentialless' allows cross-origin scripts without CORP headers
        response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
    } else {
        // All other pages — no COEP restriction
        response.headers.delete('Cross-Origin-Embedder-Policy');
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
