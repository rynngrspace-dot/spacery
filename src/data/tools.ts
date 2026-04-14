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
    desc: "Reduce file size without losing quality natively in the browser.",
    category: "Imaging"
  },
  { 
    slug: "image-filters", 
    title: "Image Filters", 
    desc: "Apply various effects including Grayscale, Bloom, and Blur.",
    category: "Imaging"
  },
  { 
    slug: "image-resizer", 
    title: "Image Resizer", 
    desc: "Resize images with aspect ratio locking for high-precision mission assets.",
    category: "Imaging"
  },
  { 
    slug: "image-cropper", 
    title: "Image Cropper", 
    desc: "Cut and crop specific sectors from visual signals with precision targeting.",
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
    desc: "Compress large video files for easier sharing across deep space distances.",
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
    title: "Video to GIF", 
    desc: "Extract sequences from video files and convert them into high-quality GIFs.",
    category: "Motion"
  },
  { 
    slug: "video-muter", 
    title: "Mute Video", 
    desc: "Strip audio tracks from video files instantly in the silent void.",
    category: "Motion"
  },

  // --- Documents ---
  { 
    slug: "pdf-compressor", 
    title: "PDF Compressor", 
    desc: "Reduce PDF file size for faster uplinks without breaking document structure.",
    category: "Documents"
  },
  { 
    slug: "pdf-merge", 
    title: "PDF Merge", 
    desc: "Combine multiple PDF documents into a single consolidated file.",
    category: "Documents"
  },
  { 
    slug: "docx-compressor", 
    title: "Word Compressor", 
    desc: "Optimize and compress Microsoft Word documents by stripping redundant data.",
    category: "Documents"
  },

  // --- Data ---
  { 
    slug: "json-formatter", 
    title: "JSON Formatter", 
    desc: "Prettify or minify JSON configurations on the fly for better legibility.",
    category: "Data"
  },
  {
    slug: "css-minifier",
    title: "CSS Minifier",
    desc: "Compress standard CSS into production-ready chunks.",
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
    desc: "Generate cryptographically secure passwords for your star systems.",
    category: "Data"
  },

  // --- Calculations ---
  { 
    slug: "unit-converter", 
    title: "Unit Converter", 
    desc: "Convert terrestrial units to astronomical scales (AU, Lightyears, Parsecs).",
    category: "Calculations"
  },
  { 
    slug: "age-calculator", 
    title: "Chronos Age Calculator", 
    desc: "Calculate your exact age and time spent in the temporal stream with high precision.",
    category: "Calculations"
  },
  { 
    slug: "color-palette", 
    title: "Color Palette Generator", 
    desc: "Generate harmonious color palettes from CSS variables or images.",
    category: "Calculations"
  },

  // --- New Utility Expansion ---
  {
    slug: "qr-generator",
    title: "Uplink QR Generator",
    desc: "Generate high-fidelity QR codes for instant data sharing across systems.",
    category: "Imaging"
  },
  {
    slug: "glassmorphism-generator",
    title: "Nebula Glass Generator",
    desc: "Design stunning frosted glass UI components with real-time CSS output.",
    category: "Imaging"
  },
  {
    slug: "color-extractor",
    title: "Spectral Color Extractor",
    desc: "Identify and extract the hex signals from any visual asset instantly.",
    category: "Imaging"
  },
  {
    slug: "case-converter",
    title: "Signature Case Converter",
    desc: "Format your text signals into different cases including UPPER, lower, and camelCase.",
    category: "Data"
  },
  {
    slug: "url-pulse-checker",
    title: "URL Pulse & Preview",
    desc: "Encode, decode, and simulate social metadata previews for your links.",
    category: "Data"
  },
  {
    slug: "reading-refiner",
    title: "Bionic Reading Refiner",
    desc: "Enhance reading velocity by bolding the primary letters of every word.",
    category: "Data"
  },
  {
    slug: "regex-tester",
    title: "RegEx Spectral Tester",
    desc: "Test and debug your Regular Expression patterns against live data streams.",
    category: "Data"
  }
];
