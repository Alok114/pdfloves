import { supabase } from '@/lib/supabase/client';
import { BlogPost } from '@/types/blog';

export async function getAllPublishedPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(mapDbPostToBlogPost);
  } catch (error) {
    console.error('Error fetching published posts:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) throw error;

    return data ? mapDbPostToBlogPost(data) : null;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published');

    if (error) throw error;

    return (data || []).map((post) => post.slug);
  } catch (error) {
    console.error('Error fetching slugs:', error);
    return [];
  }
}

// Map database column names to BlogPost interface
function mapDbPostToBlogPost(dbPost: any): BlogPost {
  return {
    id: dbPost.id,
    slug: dbPost.slug,
    title: dbPost.title,
    description: dbPost.description,
    date: dbPost.date,
    category: dbPost.category,
    cardBg: dbPost.card_bg,
    cardTextColor: dbPost.card_text_color,
    cardLabel: dbPost.card_label,
    content: dbPost.content,
    thumbnail: dbPost.thumbnail,
    status: dbPost.status,
    created_at: dbPost.created_at,
    updated_at: dbPost.updated_at,
  };
}
