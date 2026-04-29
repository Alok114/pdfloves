/**
 * Unified blog post fetching that works with both static posts and database
 * Falls back to static posts if database is unavailable
 */

import { BlogPost } from '@/types/blog';
import { blogPosts as staticPosts } from './posts';
import { getAllPublishedPosts, getPostBySlug as getDbPostBySlug, getAllPublishedSlugs } from './api';

const USE_DATABASE = process.env.NEXT_PUBLIC_USE_DATABASE === 'true';

export async function getAllPosts(): Promise<BlogPost[]> {
  if (USE_DATABASE) {
    try {
      const posts = await getAllPublishedPosts();
      if (posts.length > 0) return posts;
    } catch (error) {
      console.error('Failed to fetch from database, falling back to static posts:', error);
    }
  }
  // Add status field to static posts for compatibility
  return staticPosts.map(post => ({ ...post, status: 'published' as const }));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (USE_DATABASE) {
    try {
      const post = await getDbPostBySlug(slug);
      if (post) return post;
    } catch (error) {
      console.error('Failed to fetch from database, falling back to static posts:', error);
    }
  }
  const post = staticPosts.find((p) => p.slug === slug);
  return post ? { ...post, status: 'published' as const } : undefined;
}

export async function getAllSlugs(): Promise<string[]> {
  if (USE_DATABASE) {
    try {
      const slugs = await getAllPublishedSlugs();
      if (slugs.length > 0) return slugs;
    } catch (error) {
      console.error('Failed to fetch from database, falling back to static posts:', error);
    }
  }
  return staticPosts.map((p) => p.slug);
}
