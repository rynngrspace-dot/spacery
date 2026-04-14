export type ToolCategory = "Imaging" | "Motion" | "Data" | "Calculations" | "Documents";

export interface Tool {
  slug: string;
  title: string;
  desc: string;
  category: ToolCategory;
  isComingSoon?: boolean;
}

export const TOOLS: Tool[] = [
  // --- Imaging ---
  { 
    slug: "image-compressor", 
    title: "Image Compressor", 
    desc: "Reduce image file size without losing quality natively in the browser.",
    category: "Imaging"
  },
  { 
    slug: "image-filters", 
    title: "Image Filters", 
    desc: "Apply various effects including Grayscale, Brightness, and Blur.",
    category: "Imaging"
  },
  { 
    slug: "image-resizer", 
    title: "Image Resizer", 
    desc: "Resize images with aspect ratio locking for high-precision formatting.",
    category: "Imaging"
  },
  { 
    slug: "image-cropper", 
    title: "Image Cropper", 
    desc: "Crop specific areas from your images with pixel-perfect precision.",
    category: "Imaging"
  },
  { 
    slug: "svg-optimizer", 
    title: "SVG Optimizer", 
    desc: "Minify and clean up SVG paths for high-performance web assets.",
    category: "Imaging",
    isComingSoon: true
  },

  // --- Motion ---
  { 
    slug: "video-compressor", 
    title: "Video Compressor", 
    desc: "Compress large video files for easier sharing and storage.",
    category: "Motion"
  },
  { 
    slug: "video-cutter", 
    title: "Video Cutter", 
    desc: "Trim and cut video sequences with millisecond precision.",
    category: "Motion"
  },
  { 
    slug: "video-to-gif", 
    title: "Video to GIF Converter", 
    desc: "Convert video sequences into high-quality GIF animations.",
    category: "Motion"
  },
  { 
    slug: "video-muter", 
    title: "Video Muter", 
    desc: "Remove audio tracks from video files instantly in the browser.",
    category: "Motion"
  },

  // --- Documents ---
  { 
    slug: "pdf-compressor", 
    title: "PDF Compressor", 
    desc: "Reduce PDF file size for faster sharing without breaking document structure.",
    category: "Documents"
  },
  { 
    slug: "pdf-merge", 
    title: "PDF Merger", 
    desc: "Combine multiple PDF documents into a single consolidated file.",
    category: "Documents"
  },
  { 
    slug: "docx-compressor", 
    title: "Word Document Compressor", 
    desc: "Optimize and compress Microsoft Word documents efficiently.",
    category: "Documents"
  },

  // --- Data ---
  { 
    slug: "json-formatter", 
    title: "JSON Formatter", 
    desc: "Prettify or minify JSON configurations for better legibility.",
    category: "Data"
  },
  {
    slug: "css-minifier",
    title: "CSS Minifier",
    desc: "Compress standard CSS into production-ready file sizes.",
    category: "Data"
  },
  { 
    slug: "base64-converter", 
    title: "Base64 Converter", 
    desc: "Encode or decode strings to base64 format instantly.",
    category: "Data"
  },
  { 
    slug: "cosmic-password", 
    title: "Password Generator", 
    desc: "Generate cryptographically secure passwords for your security needs.",
    category: "Data"
  },

  // --- Calculations ---
  { 
    slug: "unit-converter", 
    title: "Unit Converter", 
    desc: "Convert standard units to astronomical scales and vice versa.",
    category: "Calculations"
  },
  { 
    slug: "age-calculator", 
    title: "Age Calculator", 
    desc: "Calculate your exact age in years, months, and days with high precision.",
    category: "Calculations"
  },
  { 
    slug: "color-palette", 
    title: "Color Palette Generator", 
    desc: "Generate harmonious color palettes for your design projects.",
    category: "Calculations"
  },

  // --- Utilities ---
  {
    slug: "qr-generator",
    title: "QR Code Generator",
    desc: "Generate high-quality QR codes for instant data sharing.",
    category: "Imaging"
  },
  {
    slug: "glassmorphism-generator",
    title: "Glassmorphism Generator",
    desc: "Design stunning frosted glass UI components with real-time CSS output.",
    category: "Imaging"
  },
  {
    slug: "color-extractor",
    title: "Color Extractor",
    desc: "Extract dominant hex color codes from any visual asset instantly.",
    category: "Imaging"
  },
  {
    slug: "case-converter",
    title: "Text Case Converter",
    desc: "Format text into various cases including UPPERCASE, lowercase, and camelCase.",
    category: "Data"
  },
  {
    slug: "url-pulse-checker",
    title: "URL Encoder & Decoder",
    desc: "Encode or decode URLs and preview how they look when shared online.",
    category: "Data"
  },
  {
    slug: "reading-refiner",
    title: "Bionic Reading Tool",
    desc: "Enhance reading speed and focus by bolding the start of every word.",
    category: "Data"
  },
  {
    slug: "regex-tester",
    title: "RegEx Tester",
    desc: "Test and debug Regular Expression patterns with live feedback.",
    category: "Data"
  }
];
