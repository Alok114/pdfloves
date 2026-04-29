export interface BlogPost {
  id?: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  cardBg: string;
  cardTextColor: string;
  cardLabel: string;
  content: string;
  thumbnail?: string;
  status: 'draft' | 'published';
  created_at?: string;
  updated_at?: string;
}

export interface BlogPostFormData {
  title: string;
  slug: string;
  description: string;
  category: string;
  cardBg: string;
  cardTextColor: string;
  cardLabel: string;
  content: string;
  thumbnail?: File | null;
  status: 'draft' | 'published';
}
