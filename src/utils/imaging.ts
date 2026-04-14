/**
 * Imaging Utilities for Spacery Laboratory
 * Powered by native Canvas API for zero-infrastructure processing.
 */

/**
 * Creates a Download Trigger in the User's browser for a given Blob.
 */
export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Resizes an image using the Canvas API.
 */
export const resizeImage = async (
  file: File, 
  targetWidth: number, 
  targetHeight: number, 
  format: string = "image/webp"
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject("Failed to initialize canvas context");

        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject("Failed to generate image blob");
        }, format, 0.9);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

/**
 * Crops an image based on fractional coordinates and dimensions.
 */
export const cropImage = async (
  imageSrc: string,
  cropArea: { x: number; y: number; width: number; height: number },
  format: string = "image/webp"
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas context unavailable");

      // Set target dimensions based on crop area
      canvas.width = cropArea.width;
      canvas.height = cropArea.height;

      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        cropArea.width,
        cropArea.height
      );

      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject("Blob generation failed");
      }, format, 0.95);
    };
    img.onerror = reject;
  });
};
