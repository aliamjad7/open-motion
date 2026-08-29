#!/usr/bin/env node
/**
 * Post-build step for @openmotion/server.
 *
 * `@openmotion/shared` is consumed as a local workspace package
 * (`"file:./src/shared"`), and its package.json points `main`/`exports` at
 * plain `.js` files living *inside* `src/shared/` (alongside the `.ts`
 * sources) rather than at a separate `dist` directory. That works
 * transparently in dev (`tsx` transpiles on the fly), but a production
 * `node dist/src/index.js` resolves `@openmotion/shared` through Node's
 * normal module resolution — which needs real `.js` files sitting next to
 * `src/shared/package.json`.
 *
 * `tsc` compiles everything (including src/shared) into `dist/src/shared`.
 * This script copies that compiled output back into `src/shared`, so the
 * workspace symlink resolves to fresh, matching JS after every build.
 */
import { cpSync, existsSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(__dirname, "..");
const compiledSharedDir = join(packageRoot, "dist", "src", "shared");
const sharedSourceDir = join(packageRoot, "src", "shared");

/** Recursively remove previously-copied build artifacts (.js/.d.ts/.map) from a directory tree, leaving .ts sources and package.json untouched. */
function cleanCompiledArtifacts(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      cleanCompiledArtifacts(full);
      continue;
    }
    if (/\.(js|d\.ts|js\.map|d\.ts\.map)$/.test(entry)) {
      rmSync(full);
    }
  }
}

function main() {
  if (!existsSync(compiledSharedDir)) {
    console.error(
      `postbuild: expected compiled output at ${compiledSharedDir} — did tsc run first?`,
    );
    process.exit(1);
  }

  // Clear out any stale compiled artifacts from a previous build so renamed
  // or removed source files don't leave orphaned .js behind.
  cleanCompiledArtifacts(sharedSourceDir);

  cpSync(compiledSharedDir, sharedSourceDir, { recursive: true });

  console.log(
    `postbuild: synced compiled @openmotion/shared output into ${sharedSourceDir}`,
  );
}

main();
