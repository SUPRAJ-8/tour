/**
 * One-time (re-runnable/idempotent) image compression pass.
 * Walks known image directories, resizes to a sane max width, recompresses,
 * and writes a .webp sibling — WITHOUT changing any filename/extension for
 * the primary output, so no DB path updates are required.
 *
 * Safety: every original is copied to backend/scripts/image-backups/<run-timestamp>/
 * (mirroring its relative path) BEFORE being overwritten. Nothing is deleted.
 *
 * Usage:
 *   node backend/scripts/optimizeImages.js            # do it
 *   node backend/scripts/optimizeImages.js --dry-run   # report only, touch nothing
 */
const fs = require('fs/promises');
const path = require('path');
const { processImageBuffer } = require('../utils/imageProcessing');

const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_BELOW_BYTES = 400 * 1024; // don't bother re-processing already-small files (idempotency guard)
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 80;

const RUN_STAMP = new Date().toISOString().replace(/[:.]/g, '-');
const BACKUP_ROOT = path.join(__dirname, 'image-backups', RUN_STAMP);

// Both the backend's own country-image copy and the frontend's duplicate copy
// are compressed, since it isn't certain from static analysis alone which one
// production actually serves (see plan's deployment-topology note).
const TARGETS = [
  path.join(__dirname, '..', 'public', 'images', 'countries'),
  path.join(__dirname, '..', 'uploads', 'covers'),
  path.join(__dirname, '..', '..', 'frontend', 'public', 'images', 'countries'),
];

async function listImages(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && /\.(jpe?g|png)$/i.test(e.name))
      .map((e) => path.join(dir, e.name));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function backupFile(absPath) {
  const rel = path.relative(path.join(__dirname, '..', '..'), absPath);
  const dest = path.join(BACKUP_ROOT, rel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.copyFile(absPath, dest);
}

async function processOne(absPath) {
  const before = (await fs.stat(absPath)).size;
  if (before < SKIP_BELOW_BYTES) {
    console.log(`  skip (already small, ${(before / 1024).toFixed(0)}KB): ${absPath}`);
    return { before, after: before, skipped: true };
  }

  const original = await fs.readFile(absPath);
  const { jpeg, webp } = await processImageBuffer(original, {
    maxWidth: MAX_WIDTH,
    jpegQuality: JPEG_QUALITY,
    webpQuality: WEBP_QUALITY,
  });

  if (DRY_RUN) {
    console.log(`  [dry-run] ${absPath}: ${(before / 1024).toFixed(0)}KB -> ${(jpeg.length / 1024).toFixed(0)}KB (+ webp ${(webp.length / 1024).toFixed(0)}KB)`);
    return { before, after: jpeg.length, skipped: false };
  }

  await backupFile(absPath);                                             // 1. back up original, unmodified
  await fs.writeFile(absPath, jpeg);                                      // 2. overwrite same path/name — no DB changes needed
  await fs.writeFile(absPath.replace(/\.(jpe?g|png)$/i, '.webp'), webp);  // 3. sibling .webp for future use

  console.log(`  ${absPath}: ${(before / 1024).toFixed(0)}KB -> ${(jpeg.length / 1024).toFixed(0)}KB`);
  return { before, after: jpeg.length, skipped: false };
}

(async function main() {
  console.log(`Image optimization pass ${DRY_RUN ? '(DRY RUN)' : ''}`);
  if (!DRY_RUN) console.log(`Backups will be written to: ${BACKUP_ROOT}`);

  let totalBefore = 0, totalAfter = 0, filesTouched = 0;

  for (const dir of TARGETS) {
    console.log(`\nScanning ${dir}`);
    const files = await listImages(dir);
    for (const file of files) {
      const result = await processOne(file);
      totalBefore += result.before;
      totalAfter += result.after;
      if (!result.skipped) filesTouched += 1;
    }
  }

  console.log('\n✨ Done.');
  console.log(`Files changed: ${filesTouched}`);
  console.log(`Total before: ${(totalBefore / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total after:  ${(totalAfter / 1024 / 1024).toFixed(2)}MB`);
  if (DRY_RUN) console.log('(dry run — nothing was written)');
})().catch((err) => {
  console.error('❌ Error optimizing images:', err);
  process.exit(1);
});
