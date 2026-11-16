// Riding the Light — ai-excited-01 entry point.
//
// The entry is a single picture the repository carries as entry.png.
// This program does exactly one thing: it places an identical copy of
// that picture at <output dir>/entry.png, where the competition expects
// it. It reads nothing else, writes nothing else, and never touches the
// network, so two runs on the same repository always produce the same
// bytes.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// The picture lives next to this file in the repository.
const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');

// The grader hands us the output directory through the environment;
// fall back to /output when it is not set.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const target = join(outDir, 'entry.png');

// Read the picture once, then write it out unchanged.
const picture = readFileSync(source);
mkdirSync(outDir, { recursive: true });
writeFileSync(target, picture);

console.log(`wrote ${target} (${picture.length} bytes)`);
