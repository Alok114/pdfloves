-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  card_bg TEXT NOT NULL DEFAULT '#e5322d',
  card_text_color TEXT NOT NULL DEFAULT '#ffffff',
  card_label TEXT NOT NULL,
  content TEXT NOT NULL,
  thumbnail TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to published posts
CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT
  USING (status = 'published');

-- Create policy to allow authenticated users to manage all posts
-- Note: You'll need to set up proper authentication for production
CREATE POLICY "Authenticated users can manage posts" ON blog_posts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for blog assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-assets', 'blog-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access
CREATE POLICY "Public can view blog assets" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-assets');

-- Create storage policy for authenticated uploads
CREATE POLICY "Authenticated users can upload blog assets" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'blog-assets');

-- Create storage policy for authenticated updates
CREATE POLICY "Authenticated users can update blog assets" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'blog-assets')
  WITH CHECK (bucket_id = 'blog-assets');

-- Create storage policy for authenticated deletes
CREATE POLICY "Authenticated users can delete blog assets" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'blog-assets');
