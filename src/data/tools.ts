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
    slug: "color-palette", 
    title: "Color Palette Generator", 
    desc: "Generate harmonious color palettes from CSS variables or images.",
    category: "Calculations"
  }
];
