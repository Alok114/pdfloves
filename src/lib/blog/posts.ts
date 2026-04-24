export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  cardBg: string;
  cardTextColor: string;
  cardLabel: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-merge-pdf-files',
    title: 'How to merge PDF files',
    description: 'Combine two or more PDF files into one single document in just a few clicks — no software needed.',
    date: 'Apr 20, 2026',
    category: 'How-to Guide',
    cardBg: '#e5322d',
    cardTextColor: '#ffffff',
    cardLabel: 'Merge PDF',
    content: `
## How to merge PDF files

Merging PDFs is one of the most common document tasks — whether you're combining a cover letter with a resume, joining chapters of a report, or assembling a multi-section contract.

Pdfloves makes it completely free and browser-based. No uploads to a server, no sign-up required.

### Steps to merge PDF files

1. Go to the **Merge PDF** tool on Pdfloves.
2. Click **Upload PDF** or drag and drop your files into the upload area.
3. Reorder the files by dragging them into the sequence you want.
4. Click **Merge PDF** and wait a moment.
5. Download your combined PDF file.

### Tips for better results

- You can upload up to 100 PDF files at once.
- Drag files to reorder them before merging.
- All processing happens in your browser — your files never leave your device.

### Why merge PDFs?

Merged documents are easier to share, archive, and print. Instead of sending five separate attachments, you send one clean file. It also keeps related content together, which is useful for contracts, portfolios, and reports.

### Related tools

- **Split PDF** — break a large PDF into smaller parts
- **Organize PDF** — reorder, rotate, or delete individual pages
- **Compress PDF** — reduce file size after merging
    `,
  },
  {
    slug: 'how-to-compress-pdf',
    title: 'How to reduce PDF file size',
    description: 'Sometimes you need to shrink a PDF for email, upload limits, or storage. Here\'s the fastest way to do it online.',
    date: 'Apr 18, 2026',
    category: 'How-to Guide',
    cardBg: '#f59e0b',
    cardTextColor: '#1a1a1a',
    cardLabel: 'Compress PDF',
    content: `
## How to reduce PDF file size

Large PDFs are a headache — they bounce back from email servers, fail to upload to portals, and eat up storage. Compressing a PDF brings the file size down without visibly degrading the content for most use cases.

### Steps to compress a PDF

1. Open the **Compress PDF** tool on Pdfloves.
2. Upload your PDF file.
3. Choose a compression level — **Recommended** works for most files.
4. Click **Compress PDF**.
5. Download the smaller file.

### Compression levels explained

- **Low compression** — minimal size reduction, highest quality. Good for print-ready files.
- **Recommended** — balanced quality and size. Best for sharing and email.
- **High compression** — maximum size reduction. Suitable for web previews or archiving.

### What gets compressed?

The tool primarily optimizes embedded images, removes redundant metadata, and flattens unnecessary layers. Text and vector graphics are not affected.

### When to compress

- Attaching PDFs to emails (most servers cap at 10–25 MB)
- Uploading to government or HR portals with strict size limits
- Storing large archives of scanned documents

### Related tools

- **Merge PDF** — combine files before compressing
- **Repair PDF** — fix corrupted files
- **Linearize PDF** — optimize for fast web viewing
    `,
  },
  {
    slug: 'how-to-convert-pdf-to-word',
    title: 'How to convert PDF to Word',
    description: 'Turn a PDF into an editable Word document quickly — useful for editing contracts, reports, and forms.',
    date: 'Apr 15, 2026',
    category: 'Conversion Guide',
    cardBg: '#2563eb',
    cardTextColor: '#ffffff',
    cardLabel: 'PDF to Word',
    content: `
## How to convert PDF to Word

PDFs are great for sharing, but terrible for editing. When you need to make changes to a document that only exists as a PDF, converting it to Word (DOCX) is the fastest path forward.

### Steps to convert PDF to Word

1. Go to the **PDF to Word** tool on Pdfloves.
2. Upload your PDF file.
3. Click **Convert to Word**.
4. Download the resulting DOCX file.
5. Open it in Microsoft Word, Google Docs, or LibreOffice.

### What to expect from the conversion

- **Text** is extracted and placed in editable paragraphs.
- **Tables** are converted to Word tables where possible.
- **Images** are embedded in the document.
- **Formatting** is preserved as closely as possible, though complex layouts may need minor cleanup.

### Tips for better conversion quality

- Use PDFs with selectable text (not scanned images) for the best results.
- If your PDF is a scanned document, use the **OCR PDF** tool first to make the text selectable.
- Simple, single-column layouts convert more accurately than complex multi-column designs.

### Common use cases

- Editing a contract you received as a PDF
- Updating a resume that was saved as PDF
- Extracting content from a report to reuse in a new document

### Related tools

- **Word to PDF** — convert back after editing
- **PDF to Excel** — extract tables into spreadsheets
- **PDF to PowerPoint** — convert presentations
    `,
  },
  // ── NEW POSTS ──────────────────────────────────────────────
  {
    slug: 'pdf-tools-for-business',
    title: 'PDF tools for business: how teams can simplify document workflows',
    description: 'Learn how business teams simplify document workflows with PDF tools for contracts, finance, and HR.',
    date: 'Apr 14, 2026',
    category: 'Business',
    cardBg: '#0ea5e9',
    cardTextColor: '#ffffff',
    cardLabel: 'Tools for business teams',
    content: `
## PDF tools for business: how teams can simplify document workflows

Modern businesses run on documents. Contracts, invoices, reports, onboarding packs — most of them end up as PDFs. But managing those files across teams? That's where things get messy.

In this guide, we'll walk through how different teams actually use PDF tools in their day-to-day work — and how Pdfloves helps simplify those workflows without adding complexity.

### Why businesses need better PDF workflows

PDFs are everywhere because they're reliable and consistent across devices. But that doesn't mean managing them is easy. Most teams deal with:

- Documents coming from different formats — Word files, spreadsheets, and scans
- Large files that are difficult to share
- Repetitive manual processes like merging or renaming files
- Sensitive data that needs extra protection

The result? Slower workflows and more room for mistakes. A better approach is to centralize everything — so teams can convert, edit, sign, and secure documents in one place.

### PDF tools for small businesses

Small teams don't usually have dedicated IT or legal support. They just need tools that work — fast.

**Creating and sending proposals**

Most proposals start in Word or PowerPoint. Converting them to PDF keeps formatting intact. From there, teams often need to merge supporting files, compress for email, or add branding elements like logos or disclaimers.

**Managing contracts and NDAs**

Contracts often come in multiple versions. A simple workflow helps: combine related documents, collect signatures with audit trails, and protect sensitive sections before sharing.

**Handling invoices and receipts**

Finance workflows in small businesses are repetitive. Convert spreadsheets to PDF for consistency, batch-compress invoice folders, and keep multi-page documents organized.

### PDF tools for legal teams

Legal teams work with high-volume, high-risk documents. Accuracy and security matter.

**Case file assembly**

Legal files often include multiple documents — pleadings, exhibits, evidence. Bringing those files together into one structured PDF makes them easier to review and share.

**Contract review and version control**

Comparing versions manually is slow and risky. A better workflow includes tools to compare PDF versions, apply watermarks like "Draft" or "Confidential", and convert final versions into locked PDFs once approved.

**Redaction and confidentiality**

Proper redaction removes underlying text permanently, prevents recovery of sensitive data, and helps meet compliance requirements.

### PDF tools for finance and accounting teams

Finance teams deal with large volumes of structured documents — and tight deadlines.

**Invoice and reporting management**

Monthly or quarterly reporting often includes dozens of files. Teams need to combine invoices and supporting documents into one package, compress large files for storage, and standardize formats across systems.

**Audit and compliance preparation**

Audits require clean, organized documentation. A better setup makes it easier to merge related files into structured audit packs, remove sensitive data before sharing, and convert documents into PDF/A for long-term archiving.

### PDF tools for HR teams

HR teams manage some of the most sensitive documents in a company.

**Onboarding and contracts**

New hires generate a lot of paperwork. Rather than sending multiple files separately, HR teams can combine contracts, policies, and forms into one PDF, send documents for signature with clear tracking, and keep everything organized from day one.

**Employee records and performance reviews**

HR files grow quickly over time. Teams often need to merge documents into single employee records, compress files without losing quality, and redact personal data before sharing anything externally.

### Security and compliance

Security is often the first concern when working with documents online.

- **Encrypted connections** — all files are transferred using secure HTTPS/SSL encryption
- **Automatic file deletion** — files are removed after processing to reduce exposure risk
- **Document-level protection** — add passwords, redact sensitive information, sign with audit trails
- **Local processing** — all processing happens in your browser; files never leave your device

### Related tools

- **Merge PDF** — combine multiple documents into one
- **Compress PDF** — reduce file size for sharing
- **Find and Redact** — permanently remove sensitive information
- **Encrypt PDF** — password-protect confidential files
    `,
  },
  {
    slug: 'how-to-crop-pdf-online',
    title: 'How to crop a PDF online and trim margins easily',
    description: 'A simple way to clean up pages, remove extra white space, and make PDFs look more professional.',
    date: 'Mar 13, 2026',
    category: 'How-to Guide',
    cardBg: '#8b5cf6',
    cardTextColor: '#ffffff',
    cardLabel: 'Crop PDF online',
    content: `
## How to crop a PDF online and trim margins easily

Scanned documents, exported reports, and converted files often come with oversized margins, unwanted borders, or extra white space. Cropping fixes all of that — and it takes less than a minute with Pdfloves.

### Steps to crop a PDF

1. Open the **Crop PDF** tool on Pdfloves.
2. Upload your PDF file.
3. Use the crop handles to select the area you want to keep.
4. Apply the crop to one page or all pages at once.
5. Download the cropped PDF.

### When to crop a PDF

- **Scanned documents** — scanners often add white borders around the content
- **Exported reports** — tools like Excel or PowerPoint sometimes add large margins when saving as PDF
- **Presentations** — slide exports may have padding that wastes space when printed
- **Academic papers** — trim oversized margins before printing or binding

### Crop vs. resize: what's the difference?

Cropping removes content outside the selected area — it changes the visible page boundary. Resizing changes the page dimensions without removing content. For cleaning up margins and borders, cropping is the right tool.

### Tips for precise cropping

- Zoom in on the preview to set crop handles accurately.
- Use "Apply to all pages" when the margins are consistent throughout the document.
- If pages have different layouts, crop them individually for best results.

### Related tools

- **Rotate PDF** — fix page orientation before cropping
- **Compress PDF** — reduce file size after cropping
- **Edit PDF** — annotate or add content after trimming
    `,
  },
  {
    slug: 'pdf-privacy-and-data-security',
    title: 'Why your PDF files are safe with Pdfloves',
    description: 'How browser-based processing, automatic deletion, and encryption keep your documents private.',
    date: 'Mar 5, 2026',
    category: 'Privacy & Security',
    cardBg: '#6b7280',
    cardTextColor: '#ffffff',
    cardLabel: 'File safety',
    content: `
## Why your PDF files are safe with Pdfloves

When you process a document online, the obvious question is: where does my file actually go?

With Pdfloves, the answer is simple — it stays in your browser.

### How browser-based processing works

Unlike traditional online tools that upload your file to a server, process it remotely, and send it back, Pdfloves runs entirely in your browser using WebAssembly.

This means:

- **Your file never leaves your device** — no upload, no server, no third-party storage
- **Processing is instant** — no waiting for a round-trip to a remote server
- **No account required** — nothing is stored or linked to your identity

### What about tools that do require a server?

A small number of operations — like certain conversion tasks — may use server-side processing. In those cases:

- Files are transferred over encrypted HTTPS connections
- Files are automatically deleted after processing
- No file content is stored, logged, or shared

### Protecting sensitive documents

If you're working with confidential files, here are the tools that help:

- **Encrypt PDF** — add a password so only authorized people can open the file
- **Find and Redact** — permanently remove sensitive text before sharing
- **Remove Restrictions** — unlock PDFs you own for editing
- **Decrypt PDF** — remove passwords from files you have access to

### Tips for handling sensitive PDFs

- Always redact before sharing — don't rely on black boxes drawn over text in image editors, as the underlying text may still be selectable
- Use password protection for contracts, financial documents, and HR files
- Process locally in your browser whenever possible

### Related tools

- **Encrypt PDF** — add password protection
- **Find and Redact** — remove sensitive content permanently
- **Compress PDF** — reduce file size before secure sharing
    `,
  },
  {
    slug: 'how-to-split-pdf',
    title: 'How to split a PDF into separate files',
    description: 'Extract specific pages or break a large PDF into smaller parts — quickly and without any software.',
    date: 'Feb 27, 2026',
    category: 'How-to Guide',
    cardBg: '#e5322d',
    cardTextColor: '#ffffff',
    cardLabel: 'Split PDF',
    content: `
## How to split a PDF into separate files

Sometimes a PDF is too large to share, or you only need a specific section of a document. Splitting lets you extract exactly what you need — without touching the rest.

### Steps to split a PDF

1. Open the **Split PDF** tool on Pdfloves.
2. Upload your PDF file.
3. Choose how you want to split:
   - **By page range** — e.g. pages 1–5, 6–10
   - **Extract every page** — each page becomes its own file
   - **Split by file size** — divide into chunks under a target size
4. Click **Split PDF**.
5. Download the resulting files (as a ZIP if multiple).

### Common split scenarios

**Extracting a single chapter**

Long reports and books often have chapters you want to share individually. Set the page range for that chapter and extract it as a standalone PDF.

**Removing pages you don't need**

If you only want pages 3–7 from a 20-page document, split out that range and discard the rest.

**Splitting for email attachments**

Email servers often have attachment size limits. Splitting a large PDF into smaller parts lets you send them across multiple emails.

**Separating scanned documents**

When multiple documents are scanned into one file, splitting by page lets you separate them into individual records.

### Tips

- Use **Extract Pages** if you want non-consecutive pages (e.g. pages 2, 5, and 9).
- Use **Delete Pages** if you want to remove specific pages and keep the rest.
- Combine with **Compress PDF** to reduce the size of each split file.

### Related tools

- **Merge PDF** — combine files back together
- **Extract Pages** — pull out specific non-consecutive pages
- **Delete Pages** — remove unwanted pages from a document
    `,
  },
  {
    slug: 'how-to-add-watermark-to-pdf',
    title: 'How to add a watermark to a PDF',
    description: 'Protect your documents and add branding by stamping text or image watermarks onto PDF pages.',
    date: 'Feb 20, 2026',
    category: 'How-to Guide',
    cardBg: '#f59e0b',
    cardTextColor: '#1a1a1a',
    cardLabel: 'Add Watermark',
    content: `
## How to add a watermark to a PDF

Watermarks serve two purposes: they protect your content from unauthorized use, and they communicate the status of a document — "Draft", "Confidential", "For Review Only".

Pdfloves lets you add text or image watermarks to any PDF in seconds.

### Steps to add a watermark

1. Open the **Add Watermark** tool on Pdfloves.
2. Upload your PDF file.
3. Choose **Text watermark** or **Image watermark**.
4. For text: type your watermark text, choose font size, color, and opacity.
5. Set the position — center, diagonal, or custom placement.
6. Apply to all pages or a specific range.
7. Click **Apply** and download the watermarked PDF.

### Text watermark options

- **Content** — any text: "Confidential", "Draft", your company name, etc.
- **Opacity** — lower opacity makes the watermark subtle; higher makes it prominent
- **Rotation** — diagonal watermarks (45°) are harder to crop out
- **Color** — match your brand or use standard gray for neutral documents

### Image watermark options

- Upload a PNG logo or stamp image
- Adjust size and position
- Use a transparent PNG for a clean overlay

### Common use cases

- **Legal documents** — stamp "Draft" or "For Review" on contracts before final sign-off
- **Reports** — add your company logo as a subtle branding element
- **Shared files** — mark documents as "Confidential" before distributing
- **Invoices** — stamp "Paid" on settled invoices

### Tips

- Use diagonal placement for security watermarks — they're harder to remove by cropping
- Keep opacity around 20–30% for subtle branding that doesn't obscure content
- For image watermarks, use a PNG with a transparent background

### Related tools

- **Add Stamps** — add date, page number, or custom stamps
- **Encrypt PDF** — combine watermarking with password protection
- **Find and Redact** — remove sensitive content before watermarking
    `,
  },
  {
    slug: 'how-to-sign-a-pdf',
    title: 'How to sign a PDF online',
    description: 'Add your signature to a PDF document quickly — draw, type, or upload your signature image.',
    date: 'Feb 13, 2026',
    category: 'How-to Guide',
    cardBg: '#10b981',
    cardTextColor: '#ffffff',
    cardLabel: 'Sign PDF',
    content: `
## How to sign a PDF online

Printing a document just to sign it and scan it back is a workflow from another era. With Pdfloves, you can sign any PDF directly in your browser — no printing, no scanning, no software.

### Steps to sign a PDF

1. Open the **Sign PDF** tool on Pdfloves.
2. Upload the PDF you need to sign.
3. Choose your signature method:
   - **Draw** — use your mouse or touchscreen to draw your signature
   - **Type** — type your name and choose a handwriting-style font
   - **Upload** — upload an image of your existing signature
4. Place the signature on the page by clicking where you want it.
5. Resize and reposition as needed.
6. Click **Apply** and download the signed PDF.

### Signature methods compared

**Draw your signature**

Best for touchscreen devices — use your finger or stylus for a natural look. On desktop, use a mouse or trackpad.

**Type your signature**

Fast and clean. Choose from several handwriting-style fonts. Good for formal documents where a consistent look matters.

**Upload a signature image**

If you already have a scanned signature saved as a PNG (with transparent background), upload it directly for the most authentic result.

### Adding initials, dates, and text

The Sign PDF tool also lets you add:

- **Initials** — place them on each page that requires initials
- **Date** — add the signing date as a text field
- **Text boxes** — fill in form fields or add notes

### Is a drawn signature legally valid?

In most countries, an electronic signature — including a drawn or typed one — is legally binding for everyday documents under laws like the ESIGN Act (US) and eIDAS (EU). For high-stakes legal documents, a **digital signature** with a certificate may be required.

### Related tools

- **Digital Sign PDF** — add a certificate-based digital signature
- **Encrypt PDF** — protect the signed document with a password
- **Flatten PDF** — lock annotations and signatures into the document
    `,
  },
];

export function getAllPosts(): BlogPost[] {
  return blogPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
