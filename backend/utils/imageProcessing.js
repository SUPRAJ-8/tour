const sharp = require('sharp');

const DEFAULT_MAX_WIDTH = 1920;
const DEFAULT_JPEG_QUALITY = 80;
const DEFAULT_WEBP_QUALITY = 80;

/**
 * Resize (max width, preserve aspect ratio, never upscale) + recompress a
 * source image buffer into a JPEG and a WebP variant.
 * @param {Buffer} inputBuffer
 * @param {{ maxWidth?: number, jpegQuality?: number, webpQuality?: number }} opts
 * @returns {Promise<{ jpeg: Buffer, webp: Buffer, width: number, height: number }>}
 */
async function processImageBuffer(inputBuffer, opts = {}) {
  const maxWidth = opts.maxWidth || DEFAULT_MAX_WIDTH;
  const jpegQuality = opts.jpegQuality || DEFAULT_JPEG_QUALITY;
  const webpQuality = opts.webpQuality || DEFAULT_WEBP_QUALITY;

  const base = sharp(inputBuffer)
    .rotate() // auto-orient using EXIF, then strip metadata on output (default)
    .resize({ width: maxWidth, withoutEnlargement: true, fit: 'inside' });

  // Use resolveWithObject on one branch to get the ACTUAL post-resize output
  // dimensions — base.metadata() would report the pre-resize input size,
  // since resize() is only applied lazily when the pipeline actually runs.
  const [jpegResult, webp] = await Promise.all([
    base.clone().jpeg({ quality: jpegQuality, mozjpeg: true, progressive: true }).toBuffer({ resolveWithObject: true }),
    base.clone().webp({ quality: webpQuality }).toBuffer(),
  ]);

  return { jpeg: jpegResult.data, webp, width: jpegResult.info.width, height: jpegResult.info.height };
}

module.exports = { processImageBuffer, DEFAULT_MAX_WIDTH, DEFAULT_JPEG_QUALITY, DEFAULT_WEBP_QUALITY };
