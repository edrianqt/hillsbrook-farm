/**
 * Makes small, modern versions of every photo in public/images (and its sub-folders):
 * AVIF and WebP files in several widths, saved in public/images/optimized/.
 * It also writes src/content/image-sizes.json, which the site uses to pick the right size
 * and to reserve space for each picture (so the page does not jump while loading).
 *
 * Run it after adding or replacing photos:   npm run images
 */
import { mkdir, readdir, writeFile } from 'node:fs/promises'
import { join, relative, extname } from 'node:path'
import sharp from 'sharp'

const ROOT = new URL('..', import.meta.url).pathname
const IMAGES = join(ROOT, 'public/images')
const OUT = join(IMAGES, 'optimized')
const MANIFEST = join(ROOT, 'src/content/image-sizes.json')
const WIDTHS = [480, 800, 1200, 1600]

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (full !== OUT) yield* walk(full)
    } else if (/\.(jpe?g|png)$/i.test(entry.name) && !/^logo/.test(entry.name)) {
      yield full
    }
  }
}

await mkdir(OUT, { recursive: true })
const manifest = {}

for await (const file of walk(IMAGES)) {
  const key = relative(join(ROOT, 'public'), file) // e.g. images/journey-1.jpg
  const { width, height } = await sharp(file).metadata()
  const name = relative(IMAGES, file).replace(/[\\/]/g, '__').replace(extname(file), '')
  const widths = WIDTHS.filter((w) => w < width).concat(width).filter((w, i, a) => a.indexOf(w) === i)
  for (const w of widths) {
    const resized = sharp(file).resize({ width: w })
    await resized.clone().avif({ quality: 50, effort: 4 }).toFile(join(OUT, `${name}-${w}.avif`))
    await resized.clone().webp({ quality: 72 }).toFile(join(OUT, `${name}-${w}.webp`))
  }
  manifest[key] = { width, height, base: `images/optimized/${name}`, widths }
  console.log(`✓ ${key}  ${width}×${height}  → ${widths.join(', ')} px`)
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`\nSaved ${Object.keys(manifest).length} pictures. Manifest: ${relative(ROOT, MANIFEST)}`)
