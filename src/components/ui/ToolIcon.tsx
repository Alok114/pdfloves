'use client';

import React from 'react';

interface ToolIconProps {
  toolId: string;
  size?: number;
  className?: string;
}

function MergePDF() {
  return <>
    <rect x="3" y="5" width="7" height="9" rx="1" fill="white" opacity="0.9"/>
    <rect x="6" y="7" width="7" height="9" rx="1" fill="white" opacity="0.6"/>
    <path d="M13 11 L16 14 L13 17" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </>;
}

function SplitPDF() {
  return <>
    <rect x="3" y="4" width="6" height="12" rx="1" fill="white" opacity="0.9"/>
    <rect x="11" y="4" width="6" height="12" rx="1" fill="white" opacity="0.6"/>
    <path d="M9.5 10 L10.5 10 M9.5 12 L10.5 12 M9.5 8 L10.5 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </>;
}

function DeletePages() {
  return <>
    <rect x="4" y="3" width="12" height="14" rx="1" fill="white" opacity="0.8"/>
    <path d="M7 8 L13 14 M13 8 L7 14" stroke="#e05a3a" strokeWidth="2" strokeLinecap="round"/>
  </>;
}

function ExtractPages() {
  return <>
    <rect x="3" y="4" width="10" height="13" rx="1" fill="white" opacity="0.8"/>
    <path d="M11 8 L17 8 M14 5 L17 8 L14 11" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </>;
}

function OrganizePDF() {
  return <>
    <rect x="3" y="3" width="6" height="8" rx="1" fill="white" opacity="0.9"/>
    <rect x="11" y="3" width="6" height="8" rx="1" fill="white" opacity="0.6"/>
    <rect x="3" y="13" width="6" height="4" rx="1" fill="white" opacity="0.6"/>
    <rect x="11" y="13" width="6" height="4" rx="1" fill="white" opacity="0.9"/>
  </>;
}

function RotatePDF() {
  return <>
    <rect x="5" y="4" width="10" height="13" rx="1" fill="white" opacity="0.8"/>
    <path d="M12 2 C15 2 17 4 17 7" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M15 5 L17 7 L19 5" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </>;
}

function PDFMultiTool() {
  return <>
    <rect x="3" y="3" width="8" height="10" rx="1" fill="white" opacity="0.9"/>
    <rect x="13" y="3" width="5" height="4" rx="1" fill="white" opacity="0.7"/>
    <rect x="13" y="9" width="5" height="4" rx="1" fill="white" opacity="0.7"/>
    <rect x="3" y="15" width="15" height="3" rx="1" fill="white" opacity="0.6"/>
  </>;
}

function CompressPDF() {
  return <>
    <rect x="4" y="3" width="12" height="15" rx="1" fill="white" opacity="0.8"/>
    <path d="M8 10 L10 12 L14 8" stroke="#4caf7d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 15 L13 15" stroke="#4caf7d" strokeWidth="1.5" strokeLinecap="round"/>
  </>;
}

function RepairPDF() {
  return <>
    <rect x="4" y="3" width="12" height="15" rx="1" fill="white" opacity="0.8"/>
    <path d="M9 8 L11 10 L15 6" stroke="#4caf7d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 13 L13 13 M7 15.5 L11 15.5" stroke="#4caf7d" strokeWidth="1.2" strokeLinecap="round"/>
  </>;
}

function OCRPDF() {
  return <>
    <rect x="3" y="5" width="14" height="11" rx="1" fill="white" opacity="0.8"/>
    <text x="5" y="14" fontSize="7" fontWeight="bold" fill="#4caf7d" fontFamily="monospace">OCR</text>
  </>;
}

function ImageToPDF() {
  return <>
    <rect x="3" y="4" width="11" height="9" rx="1" fill="white" opacity="0.9"/>
    <circle cx="6.5" cy="7" r="1.5" fill="#f5a623"/>
    <path d="M3 11 L6 8 L9 10 L11 8.5 L14 11" fill="#f5a623" opacity="0.6"/>
    <path d="M13 10 L17 10 M15 8 L17 10 L15 12" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </>;
}

function WordToPDF() {
  return <>
    <rect x="3" y="3" width="11" height="14" rx="1" fill="white" opacity="0.9"/>
    <text x="4.5" y="13" fontSize="7" fontWeight="bold" fill="#2b5ce6" fontFamily="serif">W</text>
    <path d="M13 10 L17 10 M15 8 L17 10 L15 12" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </>;
}

function ExcelToPDF() {
  return <>
    <rect x="3" y="3" width="11" height="14" rx="1" fill="white" opacity="0.9"/>
    <text x="4.5" y="13" fontSize="7" fontWeight="bold" fill="#1e7e45" fontFamily="sans-serif">X</text>
    <path d="M13 10 L17 10 M15 8 L17 10 L15 12" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </>;
}

function PPTXToPDF() {
  return <>
    <rect x="3" y="3" width="11" height="14" rx="1" fill="white" opacity="0.9"/>
    <text x="4.5" y="13" fontSize="7" fontWeight="bold" fill="#c43e1c" fontFamily="sans-serif">P</text>
    <path d="M13 10 L17 10 M15 8 L17 10 L15 12" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </>;
}

function MarkdownToPDF() {
  return <>
    <rect x="3" y="4" width="14" height="13" rx="1" fill="white" opacity="0.9"/>
    <text x="4" y="14" fontSize="6" fontWeight="bold" fill="#f5a623" fontFamily="monospace">MD</text>
    <path d="M14 8 L16 10 L14 12" stroke="#f5a623" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
  </>;
}

function TxtToPDF() {
  return <>
    <rect x="3" y="3" width="14" height="15" rx="1" fill="white" opacity="0.9"/>
    <path d="M6 8 L14 8 M6 11 L14 11 M6 14 L11 14" stroke="#f5a623" strokeWidth="1.5" strokeLinecap="round"/>
  </>;
}

function PDFToJPG() {
  return <>
    <rect x="3" y="3" width="9" height="12" rx="1" fill="white" opacity="0.9"/>
    <text x="3.5" y="12" fontSize="4" fontWeight="bold" fill="#4a90d9">PDF</text>
    <path d="M11 9 L13 9 M12 7 L14 9 L12 11" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="13" y="5" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
    <circle cx="14.5" cy="6.5" r="0.8" fill="#4a90d9"/>
    <path d="M13 9 L14.5 7.5 L16 8.5 L18 7 L18 10 L13 10" fill="#4a90d9" opacity="0.5"/>
  </>;
}

function PDFToDocx() {
  return <>
    <rect x="3" y="3" width="9" height="12" rx="1" fill="white" opacity="0.9"/>
    <text x="3.5" y="12" fontSize="4" fontWeight="bold" fill="#4a90d9">PDF</text>
    <path d="M11 9 L13 9 M12 7 L14 9 L12 11" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="13" y="5" width="5" height="8" rx="1" fill="white" opacity="0.8"/>
    <text x="13.5" y="11" fontSize="4" fontWeight="bold" fill="#2b5ce6">W</text>
  </>;
}

function PDFToPptx() {
  return <>
    <rect x="3" y="3" width="9" height="12" rx="1" fill="white" opacity="0.9"/>
    <text x="3.5" y="12" fontSize="4" fontWeight="bold" fill="#4a90d9">PDF</text>
    <path d="M11 9 L13 9 M12 7 L14 9 L12 11" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="13" y="5" width="5" height="8" rx="1" fill="white" opacity="0.8"/>
    <text x="13.5" y="11" fontSize="4" fontWeight="bold" fill="#c43e1c">P</text>
  </>;
}

function PDFToExcel() {
  return <>
    <rect x="3" y="3" width="9" height="12" rx="1" fill="white" opacity="0.9"/>
    <text x="3.5" y="12" fontSize="4" fontWeight="bold" fill="#4a90d9">PDF</text>
    <path d="M11 9 L13 9 M12 7 L14 9 L12 11" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="13" y="5" width="5" height="8" rx="1" fill="white" opacity="0.8"/>
    <text x="13.5" y="11" fontSize="4" fontWeight="bold" fill="#1e7e45">X</text>
  </>;
}

function PDFToImage() {
  return <>
    <rect x="3" y="3" width="9" height="12" rx="1" fill="white" opacity="0.9"/>
    <text x="3.5" y="12" fontSize="4" fontWeight="bold" fill="#4a90d9">PDF</text>
    <path d="M11 9 L13 9 M12 7 L14 9 L12 11" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="13" y="5" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
    <circle cx="14.5" cy="6.5" r="0.8" fill="#4a90d9"/>
    <path d="M13 9 L14.5 7.5 L16 8.5 L18 7 L18 10 L13 10" fill="#4a90d9" opacity="0.5"/>
  </>;
}

function PDFToMarkdown() {
  return <>
    <rect x="3" y="3" width="9" height="12" rx="1" fill="white" opacity="0.9"/>
    <text x="3.5" y="12" fontSize="4" fontWeight="bold" fill="#4a90d9">PDF</text>
    <path d="M11 9 L13 9 M12 7 L14 9 L12 11" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="13" y="5" width="5" height="8" rx="1" fill="white" opacity="0.8"/>
    <text x="13.2" y="11" fontSize="4" fontWeight="bold" fill="#555" fontFamily="monospace">MD</text>
  </>;
}

function PDFToPDFA() {
  return <>
    <rect x="3" y="3" width="9" height="12" rx="1" fill="white" opacity="0.9"/>
    <text x="3.5" y="12" fontSize="4" fontWeight="bold" fill="#4a90d9">PDF</text>
    <path d="M11 9 L13 9 M12 7 L14 9 L12 11" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="13" y="5" width="5" height="8" rx="1" fill="white" opacity="0.8"/>
    <text x="13.5" y="11" fontSize="4" fontWeight="bold" fill="#4a90d9">A</text>
  </>;
}

function EditPDF() {
  return <>
    <rect x="3" y="3" width="12" height="15" rx="1" fill="white" opacity="0.8"/>
    <path d="M14 5 L17 8 L10 15 L7 15 L7 12 Z" fill="white" opacity="0.9"/>
    <path d="M14 5 L17 8" stroke="#9b59b6" strokeWidth="1" fill="none"/>
  </>;
}

function SignPDF() {
  return <>
    <rect x="3" y="3" width="14" height="15" rx="1" fill="white" opacity="0.8"/>
    <path d="M5 14 C7 10 9 16 11 12 C13 8 14 14 16 13" stroke="#9b59b6" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M5 16 L16 16" stroke="#9b59b6" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
  </>;
}

function AddWatermark() {
  return <>
    <rect x="3" y="3" width="14" height="15" rx="1" fill="white" opacity="0.8"/>
    <text x="4" y="14" fontSize="5" fontWeight="bold" fill="#9b59b6" opacity="0.5" fontFamily="sans-serif" transform="rotate(-20 10 11)">DRAFT</text>
  </>;
}

function PageNumbers() {
  return <>
    <rect x="3" y="3" width="14" height="15" rx="1" fill="white" opacity="0.8"/>
    <path d="M6 8 L14 8 M6 11 L14 11 M6 14 L10 14" stroke="#9b59b6" strokeWidth="1.2" strokeLinecap="round"/>
    <text x="13" y="17" fontSize="5" fontWeight="bold" fill="#9b59b6">1</text>
  </>;
}

function CropPDF() {
  return <>
    <path d="M5 3 L5 15 L17 15" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M3 7 L15 7 L15 19" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
    <rect x="7" y="9" width="6" height="4" rx="0.5" fill="white" opacity="0.9"/>
  </>;
}

function HeaderFooter() {
  return <>
    <rect x="3" y="3" width="14" height="15" rx="1" fill="white" opacity="0.8"/>
    <rect x="3" y="3" width="14" height="3" rx="1" fill="#9b59b6" opacity="0.4"/>
    <rect x="3" y="15" width="14" height="3" rx="1" fill="#9b59b6" opacity="0.4"/>
    <path d="M6 9 L14 9 M6 12 L11 12" stroke="#9b59b6" strokeWidth="1.2" strokeLinecap="round"/>
  </>;
}

function FormFiller() {
  return <>
    <rect x="3" y="3" width="14" height="15" rx="1" fill="white" opacity="0.8"/>
    <rect x="5" y="7" width="10" height="2" rx="0.5" fill="#9b59b6" opacity="0.3"/>
    <rect x="5" y="11" width="10" height="2" rx="0.5" fill="#9b59b6" opacity="0.3"/>
    <path d="M5 7.5 L8 7.5" stroke="#9b59b6" strokeWidth="1" strokeLinecap="round"/>
    <path d="M5 11.5 L10 11.5" stroke="#9b59b6" strokeWidth="1" strokeLinecap="round"/>
  </>;
}

function EncryptPDF() {
  return <>
    <rect x="4" y="3" width="12" height="15" rx="1" fill="white" opacity="0.8"/>
    <path d="M10 5 C8 5 7 6.5 7 8 L7 9 L13 9 L13 8 C13 6.5 12 5 10 5Z" fill="#546e7a" opacity="0.7"/>
    <rect x="7" y="9" width="6" height="5" rx="0.5" fill="#546e7a" opacity="0.7"/>
    <circle cx="10" cy="11" r="1" fill="white"/>
  </>;
}

function DecryptPDF() {
  return <>
    <rect x="4" y="3" width="12" height="15" rx="1" fill="white" opacity="0.8"/>
    <path d="M13 5 C11 5 10 6.5 10 8 L10 9 L16 9 L16 8 C16 6.5 15 5 13 5Z" fill="#546e7a" opacity="0.4"/>
    <rect x="7" y="9" width="6" height="5" rx="0.5" fill="#546e7a" opacity="0.7"/>
    <circle cx="10" cy="11" r="1" fill="white"/>
  </>;
}

function FindAndRedact() {
  return <>
    <rect x="3" y="3" width="14" height="15" rx="1" fill="white" opacity="0.8"/>
    <rect x="5" y="8" width="8" height="2" rx="0.5" fill="#546e7a"/>
    <rect x="5" y="12" width="5" height="2" rx="0.5" fill="#546e7a" opacity="0.4"/>
  </>;
}

function RemoveRestrictions() {
  return <>
    <rect x="4" y="3" width="12" height="15" rx="1" fill="white" opacity="0.8"/>
    <path d="M10 5 C8 5 7 6.5 7 8 L7 9 L13 9 L13 8 C13 6.5 12 5 10 5Z" fill="#546e7a" opacity="0.4"/>
    <rect x="7" y="9" width="6" height="5" rx="0.5" fill="#546e7a" opacity="0.4"/>
    <path d="M6 6 L14 14" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </>;
}

function SanitizePDF() {
  return <>
    <rect x="4" y="3" width="12" height="15" rx="1" fill="white" opacity="0.8"/>
    <path d="M10 6 L12 8 L10 16 L8 8 Z" fill="#546e7a" opacity="0.6"/>
    <path d="M8 8 L12 8" stroke="#546e7a" strokeWidth="1" strokeLinecap="round"/>
  </>;
}

function DigitalSignPDF() {
  return <>
    <rect x="3" y="3" width="14" height="15" rx="1" fill="white" opacity="0.8"/>
    <path d="M5 14 C7 10 9 16 11 12 C13 8 14 14 16 13" stroke="#546e7a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M5 16 L16 16" stroke="#546e7a" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    <path d="M14 5 L16 7 L14 7 L14 5Z" fill="#546e7a" opacity="0.6"/>
  </>;
}

function GenericPDF() {
  return <>
    <rect x="4" y="3" width="9" height="12" rx="1" fill="white" opacity="0.9"/>
    <path d="M10 3 L13 6 L10 6 Z" fill="white" opacity="0.6"/>
    <text x="4.5" y="13" fontSize="3.5" fontWeight="bold" fill="#e05a3a" fontFamily="sans-serif">PDF</text>
  </>;
}

type IconEntry = [string, React.FC];

const TOOL_ICONS: Record<string, IconEntry> = {
  'merge-pdf':           ['#e05a3a', MergePDF],
  'split-pdf':           ['#e05a3a', SplitPDF],
  'delete-pages':        ['#e05a3a', DeletePages],
  'extract-pages':       ['#e05a3a', ExtractPages],
  'organize-pdf':        ['#e05a3a', OrganizePDF],
  'rotate-pdf':          ['#e05a3a', RotatePDF],
  'rotate-custom':       ['#e05a3a', RotatePDF],
  'pdf-multi-tool':      ['#e05a3a', PDFMultiTool],
  'compress-pdf':        ['#4caf7d', CompressPDF],
  'repair-pdf':          ['#4caf7d', RepairPDF],
  'ocr-pdf':             ['#4caf7d', OCRPDF],
  'linearize-pdf':       ['#4caf7d', CompressPDF],
  'deskew-pdf':          ['#4caf7d', RepairPDF],
  'image-to-pdf':        ['#f5a623', ImageToPDF],
  'jpg-to-pdf':          ['#f5a623', ImageToPDF],
  'png-to-pdf':          ['#f5a623', ImageToPDF],
  'webp-to-pdf':         ['#f5a623', ImageToPDF],
  'word-to-pdf':         ['#2b5ce6', WordToPDF],
  'excel-to-pdf':        ['#1e7e45', ExcelToPDF],
  'pptx-to-pdf':         ['#c43e1c', PPTXToPDF],
  'markdown-to-pdf':     ['#f5a623', MarkdownToPDF],
  'txt-to-pdf':          ['#f5a623', TxtToPDF],
  'pdf-to-jpg':          ['#4a90d9', PDFToJPG],
  'pdf-to-png':          ['#4a90d9', PDFToJPG],
  'pdf-to-image':        ['#4a90d9', PDFToImage],
  'pdf-to-docx':         ['#4a90d9', PDFToDocx],
  'pdf-to-pptx':         ['#4a90d9', PDFToPptx],
  'pdf-to-excel':        ['#4a90d9', PDFToExcel],
  'pdf-to-markdown':     ['#4a90d9', PDFToMarkdown],
  'pdf-to-pdfa':         ['#4a90d9', PDFToPDFA],
  'edit-pdf':            ['#9b59b6', EditPDF],
  'sign-pdf':            ['#9b59b6', SignPDF],
  'add-watermark':       ['#9b59b6', AddWatermark],
  'page-numbers':        ['#9b59b6', PageNumbers],
  'crop-pdf':            ['#9b59b6', CropPDF],
  'header-footer':       ['#9b59b6', HeaderFooter],
  'form-filler':         ['#9b59b6', FormFiller],
  'encrypt-pdf':         ['#546e7a', EncryptPDF],
  'decrypt-pdf':         ['#546e7a', DecryptPDF],
  'find-and-redact':     ['#546e7a', FindAndRedact],
  'remove-restrictions': ['#546e7a', RemoveRestrictions],
  'sanitize-pdf':        ['#546e7a', SanitizePDF],
  'digital-sign-pdf':    ['#546e7a', DigitalSignPDF],
};

export function ToolIcon({ toolId, size = 40, className = '' }: ToolIconProps) {
  const entry = TOOL_ICONS[toolId];
  const bg = entry ? entry[0] : '#e05a3a';
  const IconContent = entry ? entry[1] : GenericPDF;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="20" height="20" rx="3" fill={bg} />
      <IconContent />
    </svg>
  );
}

export default ToolIcon;
