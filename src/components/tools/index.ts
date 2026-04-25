import dynamic from "next/dynamic";
import React from "react";

// --- Imaging ---
const ImageCompressor = dynamic(() => import("./imaging/ImageCompressor"));
const ImageFilters = dynamic(() => import("./imaging/ImageFilters"));
const ImageResizer = dynamic(() => import("./imaging/ImageResizer"));
const ImageCropper = dynamic(() => import("./imaging/ImageCropper"));
const SVGOptimizer = dynamic(() => import("./imaging/SVGOptimizer"));
const ImageFormatConverter = dynamic(() => import("./imaging/ImageFormatConverter"));
const PngToSvg = dynamic(() => import("./imaging/PngToSvg"));
const SvgConverter = dynamic(() => import("./imaging/SvgConverter"));
const QRCodeGen = dynamic(() => import("./imaging/QRCodeGen"));
const GlassmorphismGen = dynamic(() => import("./imaging/GlassmorphismGen"));
const ColorExtractor = dynamic(() => import("./imaging/ColorExtractor"));
const AR3DVision = dynamic(() => import("@/components/tools/imaging/AR3DVision"), {
  ssr: false,
});

// --- Motion ---
const UnderConstruction = dynamic(() => import("./shared/UnderConstruction"));
// const VideoToolUI = dynamic(() => import("./motion/VideoToolUI"), { ssr: false });
// const VideoAudioRemover = dynamic(() => import("./motion/VideoMuter"), { ssr: false });
// const VideoCompressor = dynamic(() => import("./motion/VideoCompressor"), { ssr: false });
// const VideoCutter = dynamic(() => import("./motion/VideoCutter"), { ssr: false });
// const VideoToGif = dynamic(() => import("./motion/VideoToGif"), { ssr: false });

// --- Documents ---
const DocumentToolUI = dynamic(() => import("./documents/DocumentToolUI"), { ssr: false });
const ImageToPdf = dynamic(() => import("./documents/ImageToPdf"), { ssr: false });
const PDFMerger = dynamic(() => import("./documents/PDFMerger"), { ssr: false });
const PDFCompressor = dynamic(() => import("./documents/PDFCompressor"), { ssr: false });
const DOCXCompressor = dynamic(() => import("./documents/DOCXCompressor"), { ssr: false });
const UniversalDocConverter = dynamic(() => import("./documents/UniversalDocConverter"), { ssr: false });
const EbookConverter = dynamic(() => import("./documents/EbookConverter"), { ssr: false });

// --- Data ---
const JSONFormatter = dynamic(() => import("./data/JSONFormatter"), { ssr: false });
const CSVToJSON = dynamic(() => import("./data/CSVToJSON"), { ssr: false });
const GalaxyInhabitant = dynamic(() => import("./data/GalaxyInhabitant"), { ssr: false });
const CSSMinifier = dynamic(() => import("./data/CSSMinifier"));
const Base64Module = dynamic(() => import("./data/Base64Module"));
const PasswordGen = dynamic(() => import("./data/PasswordGen"));
const CaseConverter = dynamic(() => import("./data/CaseConverter"));
const URLPulseChecker = dynamic(() => import("./data/URLPulseChecker"));
const ReadingRefiner = dynamic(() => import("./data/ReadingRefiner"));
const RegExTester = dynamic(() => import("./data/RegExTester"));
const RandomChoiceMaker = dynamic(() => import("./data/RandomChoiceMaker"));

// --- Calculations ---
const UnitConverter = dynamic(() => import("./calculations/UnitConverter"));
const AgeCalculator = dynamic(() => import("./calculations/AgeCalculator"));
const DiscountCalculator = dynamic(() => import("./calculations/DiscountCalculator"));
const CurrencyConverter = dynamic(() => import("./calculations/CurrencyConverter"));
const ColorPalette = dynamic(() => import("./calculations/ColorPalette"));

/**
 * Mapping of tool slugs to their respective components.
 */
export const TOOL_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // Imaging
  "image-compressor": ImageCompressor,
  "image-filters": ImageFilters,
  "image-resizer": ImageResizer,
  "image-cropper": ImageCropper,
  "svg-optimizer": SVGOptimizer,
  "image-converter": ImageFormatConverter,
  "qr-generator": QRCodeGen,
  "glassmorphism-generator": GlassmorphismGen,
  "color-extractor": ColorExtractor,
  "arvision": AR3DVision,

  // Specific Converters (Shared Component)
  "jpg-to-png": ImageFormatConverter,
  "png-to-jpg": ImageFormatConverter,
  "webp-to-png": ImageFormatConverter,
  "webp-to-jpg": ImageFormatConverter,
  "image-to-webp": ImageFormatConverter,
  "heic-to-jpg": ImageFormatConverter,
  "heic-to-png": ImageFormatConverter,
  "jfif-to-png": ImageFormatConverter,
  "png-to-svg": PngToSvg,
  "svg-converter": SvgConverter,

  // Motion
  "video-compressor": UnderConstruction,
  "video-cutter": UnderConstruction,
  "video-to-gif": UnderConstruction,
  "video-muter": UnderConstruction,

  // Documents
  "pdf-compressor": PDFCompressor,
  "pdf-merge": PDFMerger,
  "docx-compressor": DOCXCompressor,
  "image-to-pdf": ImageToPdf,
  "pdf-converter": UniversalDocConverter,
  "document-converter": UniversalDocConverter,
  "pdf-to-word": UniversalDocConverter,
  "pdf-to-jpg": UniversalDocConverter,
  "docx-to-pdf": UniversalDocConverter,
  "heic-to-pdf": UniversalDocConverter,
  "pdf-to-epub": UniversalDocConverter,
  "epub-to-pdf": EbookConverter,
  "ebook-converter": EbookConverter,

  // Data
  "json-formatter": JSONFormatter,
  "json-validator": JSONFormatter,
  "csv-to-json": CSVToJSON,
  "css-minifier": CSSMinifier,
  "base64-converter": Base64Module,
  "cosmic-password": PasswordGen, // slug in tools.ts is cosmic-password
  "case-converter": CaseConverter,
  "url-pulse-checker": URLPulseChecker,
  "reading-refiner": ReadingRefiner,
  "regex-tester": RegExTester,
  "random-choice-maker": RandomChoiceMaker,
  "galaxy-inhabitant": GalaxyInhabitant,

  // Calculations
  "unit-converter": UnitConverter,
  "age-calculator": AgeCalculator,
  "discount-calculator": DiscountCalculator,
  "currency-converter": CurrencyConverter,
  "color-palette": ColorPalette,
};
