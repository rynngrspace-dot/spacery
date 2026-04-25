export type ToolCategory = "Imaging" | "Motion" | "Data" | "Calculations" | "Documents";

export interface Tool {
  slug: string;
  title: string;
  desc: string;
  category: ToolCategory;
  isComingSoon?: boolean;
  isNew?: boolean;
}

export const TOOLS: Tool[] = [
  // --- New & Featured ---
  {
    slug: "arvision",
    title: "3D AR Vision",
    desc: "Visualize premium 3D models in your own space using Augmented Reality. Perfect for virtual staging and spatial planning.",
    category: "Imaging",
    isNew: true
  },

  // --- Imaging ---
  { 
    slug: "image-compressor", 
    title: "Image Compressor", 
    desc: "Reduces file size while maintaining visual quality. Perfect for when your high-res photos are eating too much disk space (or space-time).",
    category: "Imaging"
  },
  { 
    slug: "jpg-to-png", 
    title: "JPG to PNG Converter", 
    desc: "Fast, lossless conversion from JPG to PNG. Transparency support included for your galactic travel photos.",
    category: "Imaging"
  },
  { 
    slug: "png-to-jpg", 
    title: "PNG to JPG Converter", 
    desc: "Convert PNG images to lightweight JPGs. Clean up your storage like a meteor shower clears the sky.",
    category: "Imaging"
  },
  { 
    slug: "heic-to-jpg", 
    title: "HEIC to JPG Converter", 
    desc: "Switch Apple's HEIC format to compatible JPGs. Finally, a way to share your moon shots with the rest of the galaxy.",
    category: "Imaging"
  },
  { 
    slug: "image-to-webp", 
    title: "Image to WebP Converter", 
    desc: "Optimize your visuals into high-performance WebP formats. Put your assets on a data-diet faster than light speed.",
    category: "Imaging"
  },
  { 
    slug: "image-filters", 
    title: "Image Filters", 
    desc: "Apply cinematic effects and visual enhancements. Because every photo deserves a glow-up before being sent into the void.",
    category: "Imaging"
  },
  { 
    slug: "image-resizer", 
    title: "Image Resizer", 
    desc: "Scale your visuals to the exact dimensions you need. Resize with precision, so your images aren't as stretched as a black hole's event horizon.",
    category: "Imaging"
  },
  { 
    slug: "image-cropper", 
    title: "Image Cropper", 
    desc: "Trim and frame your images with pixel-perfect accuracy. Cut out the background noise faster than a laser through stardust.",
    category: "Imaging"
  },
  { 
    slug: "svg-optimizer", 
    title: "SVG Optimizer", 
    desc: "Clean and minify vector paths for high-speed performance. Putting your heavy SVG files on a strict data-diet.",
    category: "Imaging",
    isComingSoon: true
  },
  {
    slug: "image-converter",
    title: "Image Format Converter",
    desc: "Swiftly switch between JPG, PNG, and WEBP formats. Change image identities faster than a galactic shapeshifter.",
    category: "Imaging"
  },

  // --- Motion ---
  { 
    slug: "video-compressor", 
    title: "Video Compressor", 
    desc: "Shrink video files for easier sharing without losing the plot. Making your 4K footage light enough for a low-bandwidth probe.",
    category: "Motion"
  },
  { 
    slug: "video-cutter", 
    title: "Video Cutter", 
    desc: "Trim clips with millisecond precision. Keep only the best scenes; truncate the boring ones like a mission report.",
    category: "Motion"
  },
  { 
    slug: "video-to-gif", 
    title: "Video to GIF Converter", 
    desc: "Transform clips into lightweight, looping animations. Create bits of internet history one loop at a time.",
    category: "Motion"
  },
  { 
    slug: "video-muter", 
    title: "Video Audio Remover", 
    desc: "Strip audio tracks from your videos instantly. Perfect for when silence is the only mission requirement.",
    category: "Motion"
  },

  // --- Documents ---
  { 
    slug: "pdf-compressor", 
    title: "PDF Compressor", 
    desc: "Compress and optimize PDF documents for rapid transmission. Small enough to fit in a pocket dimension.",
    category: "Documents"
  },
  { 
    slug: "pdf-merge", 
    title: "PDF Merger", 
    desc: "Consolidate multiple documents into a single, organized file. Stick them together without the mess of actual cosmic glue.",
    category: "Documents"
  },
  {
    slug: "image-to-pdf",
    title: "Image to PDF Converter",
    desc: "Bundle your visual assets into a professional PDF document. Wrapping your photos in a neat digital package.",
    category: "Documents"
  },
  {
    slug: "pdf-to-jpg",
    title: "PDF to JPG Converter",
    desc: "Extract pages from your PDF documents as high-quality JPG images. Bringing document layers back to the visual plane.",
    category: "Documents"
  },
  {
    slug: "pdf-to-word",
    title: "PDF to Word Converter",
    desc: "Transform PDF documents into editable Word files. Reversing the static nature of your transmissions.",
    category: "Documents"
  },
  {
    slug: "docx-to-pdf",
    title: "DOCX to PDF Converter",
    desc: "Convert Microsoft Word documents into portable PDF files. Hardening your reports for universal distribution.",
    category: "Documents"
  },
  { 
    slug: "docx-compressor", 
    title: "Word Document Compressor", 
    desc: "Efficiently optimize Microsoft Word files for sharing. Lighten the load of your intergalactic paperwork.",
    category: "Documents"
  },
  {
    slug: "heic-to-pdf",
    title: "HEIC to PDF Converter",
    desc: "Directly wrap your iPhone photos into a neat PDF document. Skipping the rasterization step for major efficiency.",
    category: "Documents"
  },
  {
    slug: "pdf-to-epub",
    title: "PDF to EPUB Converter",
    desc: "Transform your documents into reader-friendly ebook formats. Optimized for digital scrolls across the galaxy.",
    category: "Documents"
  },
  {
    slug: "epub-to-pdf",
    title: "EPUB to PDF Converter",
    desc: "Flatten ebook formats back into standard documents for printing or sharing.",
    category: "Documents"
  },
  {
    slug: "ebook-converter",
    title: "Universal Ebook Converter",
    desc: "Cross-transcode between various ebook and document formats with ease.",
    category: "Documents"
  },
  {
    slug: "webp-to-png",
    title: "WEBP to PNG Converter",
    desc: "Convert high-efficiency WEBP visuals back to lossless PNG formats.",
    category: "Imaging"
  },
  {
    slug: "webp-to-jpg",
    title: "WEBP to JPG Converter",
    desc: "Switch WEBP assets to standard JPG formats for maximum compatibility.",
    category: "Imaging"
  },
  {
    slug: "jfif-to-png",
    title: "JFIF to PNG Converter",
    desc: "Cleanly convert legacy JFIF images into modern, transparent PNG formats.",
    category: "Imaging"
  },
  {
    slug: "heic-to-png",
    title: "HEIC to PNG Converter",
    desc: "Transform specialized Apple formats into universal, lossless PNG visuals.",
    category: "Imaging"
  },
  {
    slug: "png-to-svg",
    title: "PNG to SVG Vectorizer",
    desc: "Trace raster PNG pixels into scalable vector paths. Infinite resolution for your digital icons.",
    category: "Imaging"
  },
  {
    slug: "svg-converter",
    title: "SVG Rasterizer",
    desc: "Convert vector SVG files into JPG, PNG, or WEBP raster formats.",
    category: "Imaging"
  },

  // --- Data ---
  { 
    slug: "json-formatter", 
    title: "JSON Formatter", 
    desc: "Prettify or minify your JSON data structures. Turn your messy code into a neat row of well-behaved droids.",
    category: "Data"
  },
  {
    slug: "css-minifier",
    title: "CSS Minifier",
    desc: "Strip whitespace and comments from your stylesheets. Crush your code into a high-performance single line of logic.",
    category: "Data"
  },
  { 
    slug: "base64-converter", 
    title: "Base64 Converter", 
    desc: "Encode or decode data into clean, URL-safe strings. Translate your secrets into universal digital dialect.",
    category: "Data"
  },
  { 
    slug: "cosmic-password", 
    title: "Password Generator", 
    desc: "Create cryptographically secure, random passwords. So strong even a telepathic alien couldn't guess your pet's name.",
    category: "Data"
  },

  // --- Calculations ---
  { 
    slug: "unit-converter", 
    title: "Unit Converter", 
    desc: "Translate measurements between standard and astronomical scales. From millimeters to megaparsecs in a single blink.",
    category: "Calculations"
  },
  { 
    slug: "age-calculator", 
    title: "Age Calculator", 
    desc: "Determine your exact age down to the day. Exactly how many times have you orbited the sun? (Don't feel too old).",
    category: "Calculations"
  },
  { 
    slug: "discount-calculator", 
    title: "Discount Calculator", 
    desc: "Calculate final prices and total savings during sales. Don't overpay for that rocket fuel ever again.",
    category: "Calculations"
  },
  {
    slug: "currency-converter",
    title: "Currency Converter",
    desc: "Check real-time exchange rates for global commerce. Swap your coins faster than local star-traders.",
    category: "Calculations"
  },
  { 
    slug: "color-palette", 
    title: "Color Palette Generator", 
    desc: "Create harmonious color schemes for your design missions. Painting the void with beautiful hex codes.",
    category: "Calculations"
  },

  // --- Utilities ---
  {
    slug: "qr-generator",
    title: "QR Code Generator",
    desc: "Generate high-quality QR codes for instant data beaming. A square of logic for the curious traveler.",
    category: "Imaging"
  },
  {
    slug: "glassmorphism-generator",
    title: "Glassmorphism Generator",
    desc: "Design frosted glass UI components with live CSS output. Frosted visuals for the most sophisticated space stations.",
    category: "Imaging"
  },
  {
    slug: "color-extractor",
    title: "Color Extractor",
    desc: "Pick dominant hex codes from any image instantly. Sucking the color right out of a nebula (or a JPG).",
    category: "Imaging"
  },
  {
    slug: "case-converter",
    title: "Text Case Converter",
    desc: "Swap between UPPERCASE, lowercase, and camelCase. Format your transmissions for maximum clarity.",
    category: "Data"
  },
  {
    slug: "url-pulse-checker",
    title: "URL Encoder & Decoder",
    desc: "Clean up messy URLs for safer, prettier links. Untangling long strings of internet spaghetti.",
    category: "Data"
  },
  {
    slug: "reading-refiner",
    title: "Bionic Reading Tool",
    desc: "Enhance focus and speed by bolding the start of every word. Hack your brain for high-speed data consumption.",
    category: "Data"
  },
  {
    slug: "regex-tester",
    title: "RegEx Tester",
    desc: "Debug Regular Expressions with real-time Pattern matching. No more guessing why your logic broke—peek into the matrix.",
    category: "Data"
  },
  {
    slug: "random-choice-maker",
    title: "Random Choice Maker",
    desc: "Let fate decide—randomly pick an item from your list. Let the void choose so you don't have to.",
    category: "Data"
  },
  {
    slug: "csv-to-json",
    title: "CSV to JSON Converter",
    desc: "Cleanly transcode CSV data streams into structured JSON matrices. Bridging the gap between legacy logs and modern logic.",
    category: "Data"
  },
  {
    slug: "galaxy-inhabitant",
    title: "Galaxy Inhabitant Generator",
    desc: "Synthesize random life-form data for population simulation. Populating the void with simulated intelligence.",
    category: "Data"
  }
];
