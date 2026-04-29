#!/usr/bin/env node

/**
 * Script to delete all posts and create 10 new blog posts
 * Run: node scripts/reset-blog-posts.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load .env.local
const envPath = join(rootDir, '.env.local');
const envContent = readFileSync(envPath, 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const newPosts = [
  {
    slug: 'how-to-merge-pdf-files',
    title: 'How to Merge PDF Files Online',
    description: 'Combine multiple PDF files into one document quickly and easily. Learn the best way to merge PDFs without losing quality.',
    category: 'How-to Guide',
    cardBg: '#e5322d',
    cardTextColor: '#ffffff',
    cardLabel: 'Merge PDF',
    content: `## How to Merge PDF Files Online

Merging PDF files is one of the most common document tasks. Whether you're combining a cover letter with a resume, joining chapters of a report, or assembling a multi-section contract, PDFLoves makes it simple and free.

### Why Merge PDFs?

- **Easier sharing** - Send one file instead of multiple attachments
- **Better organization** - Keep related documents together
- **Professional presentation** - Create cohesive documents for clients
- **Simplified archiving** - Store complete document sets in one file

### Steps to Merge PDF Files

1. Go to the **Merge PDF** tool on PDFLoves
2. Click **Upload PDF** or drag and drop your files
3. Reorder files by dragging them into your preferred sequence
4. Click **Merge PDF** and wait a moment
5. Download your combined PDF file

### Tips for Better Results

- You can upload up to 100 PDF files at once
- Drag files to reorder them before merging
- All processing happens in your browser - your files never leave your device
- No file size limits or watermarks

### Common Use Cases

**Business Documents**: Combine invoices, contracts, and supporting documents into one package for clients or accounting.

**Academic Papers**: Merge research papers, appendices, and references into a single submission-ready document.

**Reports**: Combine executive summaries, data tables, and charts into comprehensive reports.`,
  },
  {
    slug: 'how-to-compress-pdf',
    title: 'How to Compress PDF Files and Reduce Size',
    description: 'Reduce PDF file size without losing quality. Perfect for email attachments and faster uploads.',
    category: 'How-to Guide',
    cardBg: '#f59e0b',
    cardTextColor: '#1a1a1a',
    cardLabel: 'Compress PDF',
    content: `## How to Compress PDF Files and Reduce Size

Large PDF files can be problematic - they bounce back from email servers, fail to upload to portals, and consume storage space. Compressing PDFs reduces file size while maintaining acceptable quality.

### When to Compress PDFs

- Email attachments (most servers limit 10-25 MB)
- Website uploads with size restrictions
- Faster file transfers and downloads
- Storage space optimization
- Mobile device compatibility

### Compression Methods

**Standard Compression**: Reduces file size by 40-60% while maintaining good quality for screen viewing.

**High Compression**: Achieves 70-80% size reduction, suitable for archiving or when quality is less critical.

**Custom Compression**: Adjust settings to balance quality and file size for your specific needs.

### What Gets Compressed?

- **Images**: Optimized and downscaled if necessary
- **Metadata**: Unnecessary data removed
- **Fonts**: Subset and optimized
- **Redundant objects**: Eliminated

### Best Practices

1. Always keep an original uncompressed copy
2. Test compressed files before sharing
3. Use appropriate compression level for your use case
4. Consider your audience's needs (print vs screen)`,
  },
  {
    slug: 'convert-pdf-to-word',
    title: 'Convert PDF to Word - Free Online Converter',
    description: 'Turn PDFs into editable Word documents in seconds. Perfect for editing contracts, reports, and forms.',
    category: 'Conversion Guide',
    cardBg: '#2563eb',
    cardTextColor: '#ffffff',
    cardLabel: 'PDF to Word',
    content: `## Convert PDF to Word - Free Online Converter

Need to edit a PDF? Converting it to Word (DOCX) format gives you full editing capabilities. PDFLoves makes this conversion fast, accurate, and completely free.

### Why Convert PDF to Word?

- **Edit content** - Modify text, images, and formatting
- **Reuse content** - Extract and repurpose document sections
- **Collaborate** - Use Word's track changes and comments
- **Update documents** - Refresh outdated information

### Conversion Quality

Our converter preserves:
- Text formatting and fonts
- Images and graphics
- Tables and layouts
- Headers and footers
- Page structure

### Steps to Convert

1. Upload your PDF file
2. Click **Convert to Word**
3. Download the DOCX file
4. Open in Microsoft Word, Google Docs, or LibreOffice

### Tips for Best Results

- PDFs with selectable text convert better than scanned images
- Simple layouts convert more accurately than complex designs
- Use OCR for scanned documents first
- Review formatting after conversion`,
  },
  {
    slug: 'split-pdf-pages',
    title: 'Split PDF into Separate Pages or Files',
    description: 'Extract specific pages or split large PDFs into smaller files. Fast, free, and easy to use.',
    category: 'How-to Guide',
    cardBg: '#8b5cf6',
    cardTextColor: '#ffffff',
    cardLabel: 'Split PDF',
    content: `## Split PDF into Separate Pages or Files

Sometimes you need just one chapter from a book, or you need to divide a large PDF into manageable chunks. PDFLoves makes splitting PDFs simple and precise.

### Split Options

**By Page Range**: Extract pages 1-10, 15-20, etc.

**Every Page**: Convert each page into a separate PDF file.

**By File Size**: Divide into chunks under a target size.

**Custom Selection**: Choose specific non-consecutive pages.

### Common Use Cases

- Extract a single chapter from a book
- Remove unwanted pages
- Split for email size limits
- Separate scanned documents
- Create individual invoices from batch files

### How to Split a PDF

1. Upload your PDF file
2. Choose split method (range, every page, or size)
3. Select pages or set parameters
4. Click **Split PDF**
5. Download individual files (as ZIP if multiple)

### Pro Tips

- Preview pages before splitting
- Use page numbers from the PDF viewer
- Combine with merge to reorganize documents
- Split before compressing for better control`,
  },
  {
    slug: 'rotate-pdf-pages',
    title: 'Rotate PDF Pages - Fix Page Orientation',
    description: 'Rotate PDF pages 90, 180, or 270 degrees. Fix scanned documents and adjust page orientation easily.',
    category: 'How-to Guide',
    cardBg: '#10b981',
    cardTextColor: '#ffffff',
    cardLabel: 'Rotate PDF',
    content: `## Rotate PDF Pages - Fix Page Orientation

Scanned documents often have incorrect page orientation. Rotating PDF pages fixes this issue and makes documents easier to read and share.

### When to Rotate PDFs

- Scanned documents with wrong orientation
- Mixed portrait and landscape pages
- Photos inserted incorrectly
- Documents from mobile scanning apps

### Rotation Options

**90° Clockwise**: Standard right rotation

**90° Counter-clockwise**: Standard left rotation

**180°**: Flip upside down

**Apply to**: Single page, all pages, or selected pages

### How to Rotate PDF Pages

1. Upload your PDF file
2. Select pages to rotate
3. Choose rotation angle (90°, 180°, 270°)
4. Preview the result
5. Download rotated PDF

### Best Practices

- Preview before saving
- Rotate all pages at once if orientation is consistent
- Use page thumbnails to identify incorrect pages
- Combine with crop for perfect results`,
  },
  {
    slug: 'add-page-numbers-to-pdf',
    title: 'Add Page Numbers to PDF Documents',
    description: 'Insert page numbers into PDF files with custom formatting. Choose position, style, and starting number.',
    category: 'How-to Guide',
    cardBg: '#f59e0b',
    cardTextColor: '#1a1a1a',
    cardLabel: 'Page Numbers',
    content: `## Add Page Numbers to PDF Documents

Page numbers make documents easier to navigate and reference. Add professional page numbering to any PDF with custom formatting and positioning.

### Numbering Options

**Position**: Top or bottom, left, center, or right

**Format**: 1, 2, 3 or Page 1 of 10 or i, ii, iii (Roman numerals)

**Starting Number**: Begin at any number

**Page Range**: Apply to all pages or specific ranges

### Why Add Page Numbers?

- Professional appearance
- Easy reference in discussions
- Required for formal documents
- Better navigation in long documents
- Print-ready formatting

### Customization Features

- Font size and style
- Text color
- Margins and spacing
- Skip first page (for cover pages)
- Different numbering for sections

### How to Add Page Numbers

1. Upload your PDF
2. Choose position and format
3. Set starting number
4. Preview the result
5. Download numbered PDF`,
  },
  {
    slug: 'protect-pdf-with-password',
    title: 'Protect PDF with Password - Secure Your Documents',
    description: 'Add password protection to PDF files. Prevent unauthorized access and secure sensitive documents.',
    category: 'Security',
    cardBg: '#dc2626',
    cardTextColor: '#ffffff',
    cardLabel: 'Protect PDF',
    content: `## Protect PDF with Password - Secure Your Documents

Protect sensitive PDFs with password encryption. Control who can open, edit, or print your documents.

### Protection Types

**Open Password**: Required to view the document

**Permissions Password**: Restricts editing, printing, and copying

**Both**: Maximum security with dual passwords

### Security Levels

**128-bit AES**: Standard encryption for most documents

**256-bit AES**: Military-grade encryption for highly sensitive files

### What You Can Restrict

- Printing (allow, disallow, or low quality only)
- Editing (prevent all changes)
- Copying text and images
- Adding comments and annotations
- Filling form fields
- Extracting pages

### How to Password Protect a PDF

1. Upload your PDF file
2. Choose protection type
3. Enter password(s)
4. Set permissions
5. Download protected PDF

### Best Practices

- Use strong passwords (12+ characters)
- Store passwords securely
- Don't share passwords via email
- Keep unprotected backup in safe location`,
  },
  {
    slug: 'convert-images-to-pdf',
    title: 'Convert Images to PDF - JPG, PNG to PDF',
    description: 'Convert JPG, PNG, and other images to PDF format. Combine multiple images into one PDF document.',
    category: 'Conversion Guide',
    cardBg: '#8b5cf6',
    cardTextColor: '#ffffff',
    cardLabel: 'Image to PDF',
    content: `## Convert Images to PDF - JPG, PNG to PDF

Transform images into professional PDF documents. Perfect for creating photo albums, portfolios, or document scans.

### Supported Formats

- JPG/JPEG
- PNG
- GIF
- BMP
- TIFF
- WebP

### Conversion Features

**Multiple Images**: Combine several images into one PDF

**Page Size**: Auto-fit, A4, Letter, or custom dimensions

**Orientation**: Portrait or landscape

**Margins**: Add spacing around images

**Image Quality**: Adjust compression level

### Common Use Cases

- Create photo albums
- Compile design portfolios
- Convert scanned documents
- Share image collections
- Create presentation handouts

### How to Convert Images to PDF

1. Upload one or more images
2. Arrange in desired order
3. Choose page size and orientation
4. Adjust quality settings
5. Download PDF

### Tips for Best Results

- Use high-resolution images for print
- Compress for web sharing
- Maintain consistent image sizes
- Use portrait for documents, landscape for photos`,
  },
  {
    slug: 'sign-pdf-electronically',
    title: 'Sign PDF Electronically - Add Digital Signature',
    description: 'Add your signature to PDF documents online. Draw, type, or upload your signature for free.',
    category: 'How-to Guide',
    cardBg: '#2563eb',
    cardTextColor: '#ffffff',
    cardLabel: 'Sign PDF',
    content: `## Sign PDF Electronically - Add Digital Signature

Sign PDFs without printing. Add legally binding electronic signatures to contracts, forms, and documents in seconds.

### Signature Methods

**Draw**: Use mouse or touchscreen to draw your signature

**Type**: Type your name in handwriting-style fonts

**Upload**: Use an image of your existing signature

**Digital Certificate**: Add certificate-based digital signature

### Legal Validity

Electronic signatures are legally binding in most countries under:
- ESIGN Act (United States)
- eIDAS (European Union)
- Electronic Transactions Act (Australia)

### Additional Elements

- Date stamps
- Initials
- Text annotations
- Checkmarks
- Custom stamps

### How to Sign a PDF

1. Upload your PDF document
2. Choose signature method
3. Create or upload signature
4. Position on document
5. Add date if needed
6. Download signed PDF

### Security Features

- Tamper-evident seals
- Audit trails
- Certificate validation
- Timestamp verification`,
  },
  {
    slug: 'ocr-pdf-scan-to-text',
    title: 'OCR PDF - Convert Scanned PDF to Searchable Text',
    description: 'Extract text from scanned PDFs using OCR technology. Make scanned documents searchable and editable.',
    category: 'Conversion Guide',
    cardBg: '#10b981',
    cardTextColor: '#ffffff',
    cardLabel: 'OCR PDF',
    content: `## OCR PDF - Convert Scanned PDF to Searchable Text

Optical Character Recognition (OCR) converts scanned images and PDFs into searchable, editable text. Essential for digitizing paper documents.

### What is OCR?

OCR technology recognizes text in images and converts it to actual text data. This makes scanned documents:
- Searchable
- Editable
- Copy-pasteable
- Accessible to screen readers

### Supported Languages

- English
- Spanish
- French
- German
- Italian
- Portuguese
- Chinese
- Japanese
- And 100+ more languages

### OCR Accuracy Factors

**High Accuracy**:
- Clear, high-resolution scans
- Standard fonts
- Good contrast
- Straight text alignment

**Lower Accuracy**:
- Blurry or low-resolution images
- Handwritten text
- Unusual fonts
- Skewed or rotated text

### How to OCR a PDF

1. Upload scanned PDF
2. Select language(s)
3. Click **Start OCR**
4. Wait for processing
5. Download searchable PDF

### Best Practices

- Scan at 300 DPI or higher
- Use black and white for text documents
- Straighten pages before scanning
- Clean up image quality first
- Review OCR results for accuracy`,
  },
];

async function resetBlogPosts() {
  console.log('🗑️  Deleting existing posts...\n');

  // Delete all existing posts
  const { error: deleteError } = await supabase
    .from('blog_posts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

  if (deleteError) {
    console.error('Error deleting posts:', deleteError);
  } else {
    console.log('✅ All existing posts deleted\n');
  }

  console.log(`📝 Creating ${newPosts.length} new blog posts...\n`);

  for (const post of newPosts) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          slug: post.slug,
          title: post.title,
          description: post.description,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          category: post.category,
          card_bg: post.cardBg,
          card_text_color: post.cardTextColor,
          card_label: post.cardLabel,
          content: post.content,
          status: 'published',
        });

      if (error) {
        console.error(`❌ Error creating post "${post.title}":`, error);
      } else {
        console.log(`✅ Created: ${post.title}`);
      }
    } catch (err) {
      console.error(`❌ Exception creating post "${post.title}":`, err);
    }
  }

  console.log('\n🎉 Blog reset complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   - Deleted: All old posts`);
  console.log(`   - Created: ${newPosts.length} new posts`);
  console.log(`\n🌐 View at: http://localhost:3000/en/blog/`);
}

resetBlogPosts();
