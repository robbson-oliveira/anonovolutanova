/**
 * Resolves the tsconfig path aliases so `node --test` can load source files.
 * Next compiles those aliases on its own; this file is only for the tests.
 */
import { fileURLToPath, pathToFileURL } from "node:url";

const src = fileURLToPath(new URL("../src/", import.meta.url));

const prefixes = [
  ["@/", ""],
  ["@content/", "content/"],
  ["@ds/", "ds/"],
  ["@sections/", "sections/"],
];

export async function resolve(specifier, context, nextResolve) {
  for (const [prefix, folder] of prefixes) {
    if (!specifier.startsWith(prefix)) continue;
    const rest = specifier.slice(prefix.length);
    const file = pathToFileURL(`${src}${folder}${rest}.ts`).href;
    return nextResolve(file, context);
  }
  return nextResolve(specifier, context);
}
