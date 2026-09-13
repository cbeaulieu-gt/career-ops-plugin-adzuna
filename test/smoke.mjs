// Zero-network smoke test: the entry imports cleanly and exposes only valid
// hooks that match the manifest. Run by the Career-Ops installer and CI.
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const KINDS = ['provider', 'ingest', 'search', 'notify', 'export'];

const manifest = JSON.parse(readFileSync(path.join(here, '..', 'manifest.json'), 'utf8'));
const entryUrl = pathToFileURL(path.join(here, '..', manifest.entry || 'index.mjs')).href;
const mod = await import(entryUrl);
const hooks = mod.default;

assert(hooks && typeof hooks === 'object', 'default export must be an object of hooks');
const keys = Object.keys(hooks);
assert(keys.length > 0, 'declare at least one hook');
for (const key of keys) assert(KINDS.includes(key), `unknown hook "${key}"`);
for (const hook of manifest.hooks) {
  assert(keys.includes(hook), `manifest declares hook "${hook}" but index.mjs does not export it`);
}

console.log('✓ smoke ok:', keys.join(', '));
