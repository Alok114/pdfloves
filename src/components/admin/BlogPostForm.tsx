'use client';

import { useState, useEffect } from 'react';
import { BlogPost } from '@/types/blog';

interface BlogPostFormProps {
  post?: BlogPost;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export function BlogPostForm({ post, onSubmit, onCancel }: BlogPostFormProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    description: post?.description || '',
    category: post?.category || 'How-to Guide',
    cardBg: post?.cardBg || '#e5322d',
    cardTextColor: post?.cardTextColor || '#ffffff',
    cardLabel: post?.cardLabel || '',
    content: post?.content || '',
    thumbnail: post?.thumbnail || '',
    status: post?.status || 'draft',
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [useThumbnail, setUseThumbnail] = useState(!!post?.thumbnail);

  // Auto-generate slug from title WITHOUT /blog prefix (route handles that)
  useEffect(() => {
    if (!post && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, post]);

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setThumbnailFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setFormData((prev) => ({ ...prev, thumbnail: data.url }));
      console.log('✅ Thumbnail uploaded successfully:', data.url);
    } catch (error: any) {
      console.error('Error uploading thumbnail:', error);
      alert(`Failed to upload thumbnail: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent, status?: 'draft' | 'published') => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        status: status || formData.status,
        date: post?.date || new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        // Clear thumbnail if not using it
        thumbnail: useThumbnail ? formData.thumbnail : '',
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>How-to Guide</option>
            <option>Conversion Guide</option>
            <option>Business</option>
            <option>Privacy & Security</option>
            <option>Tips & Tricks</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Label *
          </label>
          <input
            type="text"
            value={formData.cardLabel}
            onChange={(e) => setFormData({ ...formData, cardLabel: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Card Display Options</h3>
        
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="useThumbnail"
            checked={useThumbnail}
            onChange={(e) => setUseThumbnail(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="useThumbnail" className="text-sm font-medium text-gray-700">
            Use thumbnail image for card (instead of colored background with label)
          </label>
        </div>

        {useThumbnail ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thumbnail Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
            {formData.thumbnail && (
              <div className="mt-2 space-y-2">
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-2">Thumbnail URL:</p>
                  <p className="text-xs text-gray-600 break-all font-mono bg-white p-2 rounded border">
                    {formData.thumbnail}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <a 
                      href={formData.thumbnail} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Open in new tab ↗
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(formData.thumbnail);
                        alert('URL copied to clipboard!');
                      }}
                      className="text-xs text-gray-600 hover:text-gray-900"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
                <p className="text-xs text-green-600">✅ Thumbnail uploaded successfully</p>
              </div>
            )}
            {!formData.thumbnail && (
              <p className="text-sm text-amber-600 mt-1">⚠️ Please upload a thumbnail image</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Background Color *
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.cardBg}
                    onChange={(e) => setFormData({ ...formData, cardBg: e.target.value })}
                    className="h-10 w-20 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={formData.cardBg}
                    onChange={(e) => setFormData({ ...formData, cardBg: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Text Color *
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.cardTextColor}
                    onChange={(e) => setFormData({ ...formData, cardTextColor: e.target.value })}
                    className="h-10 w-20 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    value={formData.cardTextColor}
                    onChange={(e) => setFormData({ ...formData, cardTextColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Label *
              </label>
              <input
                type="text"
                value={formData.cardLabel}
                onChange={(e) => setFormData({ ...formData, cardLabel: e.target.value })}
                required={!useThumbnail}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Merge PDF, Compress PDF"
              />
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Preview
              </label>
              <div
                className="w-full h-32 rounded-md flex items-center justify-center"
                style={{ backgroundColor: formData.cardBg }}
              >
                <span
                  className="text-xl font-bold text-center px-4"
                  style={{ color: formData.cardTextColor }}
                >
                  {formData.cardLabel || 'Your Label Here'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content * (Markdown supported)
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          required
          rows={15}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          placeholder="## Heading&#10;&#10;Your content here...&#10;&#10;### Subheading&#10;&#10;- List item 1&#10;- List item 2"
        />
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'draft')}
          disabled={loading || uploading}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, 'published')}
          disabled={loading || uploading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {post?.status === 'published' ? 'Update & Publish' : 'Publish'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
