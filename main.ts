// Riding the Light — ai-excited-01 entry point.
//
// The entry is a single picture the repository carries as entry.png:
// a lighthouse on a storm coast whose beam bends into a glowing
// golden roller-coaster track, the train at the top of a huge vertical
// loop in the sky, upside down and throwing off sparks, lightning
// all around and waves crashing below.
//
// This program does exactly one thing: it places an identical copy of
// that picture at <output dir>/entry.png, where the competition expects
// it. It reads nothing else, writes nothing else, and never touches the
// network, so two runs on the same repository always produce the same
// bytes.
//
// Before copying it checks the picture is really there and really an
// image (a JPEG or a PNG, by its magic bytes), and after writing it
// reads the copy back and confirms the bytes match — so a missing
// source, a corrupt picture, or a failed write fails loudly with a
// clear message instead of silently producing a broken entry.

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// The picture lives next to this file in the repository.
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');

// The grader hands us the output directory through the environment;
// fall back to /output when it is not set.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

function fail(message) {
  console.error(`riding-the-light: ${message}`);
  process.exit(1);
}

// A JPEG starts FF D8 FF; a PNG starts 89 50 4E 47 0D 0A 1A 0A.
function isImage(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return true;
  const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return bytes.length >= 8 && bytes.subarray(0, 8).equals(pngMagic);
}

if (!existsSync(source)) fail(`entry picture not found: ${source}`);
const picture = readFileSync(source);
if (!isImage(picture)) fail(`entry picture is not a JPEG or PNG: ${source} (${picture.length} bytes)`);

mkdirSync(outDir, { recursive: true });
writeFileSync(target, picture);

// Read the copy back: the entry is only good if the bytes match.
const written = readFileSync(target);
if (!written.equals(picture)) fail(`written copy does not match the source: ${target}`);

console.log(`wrote ${target} (${picture.length} bytes, verified)`);
