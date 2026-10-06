// Independent coverage check of the CEX-790 audit's gateway_route set.
//
// The audit ships its own extractor (scripts/cex790-inventory.mjs). Re-running it would only confirm that the script
// agrees with itself. This walks the REAL dispatch chain in services/dev-gateway/server.mjs with different, cruder
// logic - every `path===`, `path.startsWith` and route regex inside the request handler - and set-differences the two
// sides. Both directions matter:
//   in source, not in inventory  -> the audit missed a route (an understated inventory)
//   in inventory, not in source  -> the audit invented a route (an overstated inventory)
//
//   usage: node cex790-route-coverage.mjs <worktree>
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';

const worktree = process.argv[2];
if (!worktree) { console.error('usage: node cex790-route-coverage.mjs <worktree>'); process.exit(2); }
const source = readFileSync(resolve(worktree, 'services/dev-gateway/server.mjs'), 'utf8');

// The WHOLE file, deliberately. Slicing "just the routing chain" was the first version of this script and it silently
// truncated at a `// ===` banner, reporting 10 patterns and 42 phantom mismatches - a crude extractor that claims more
// precision than it has. Scanning everything may over-collect (a `path===` outside the handler would count), so the two
// sets below are reported as raw set-differences with that caveat stated, not as an authoritative route list.
const chain = source;

const found = new Map();
// Plain string scanning, not a regex character class. The first version used /path===`?([^`'|]+)`?/g and silently
// under-collected: it found 11 of the 58 `path===` occurrences in the file and produced a confident, entirely wrong
// 42-route "in the audit but not in source" list. A count cross-check (58 raw occurrences vs 11 captures) is the only
// reason it was caught, which is the same instrument-error class this programme has now recorded four times.
const quoteDelimited = (parts, marker) => {
  for (const part of parts.slice(1)) {
    const quote = part[0];
    if (quote !== "'" && quote !== '"' && quote !== '`') continue;
    const end = part.indexOf(quote, 1);
    if (end !== -1) found.set(part.slice(1, end), `${marker} ${part.slice(1, end)}`);
  }
};
quoteDelimited(source.split('path==='), 'path===');
quoteDelimited(source.split('path.startsWith('), 'startsWith');
console.log(`raw path=== occurrences in source            : ${source.split('path===').length - 1}`);
console.log(`distinct path=== captures                    : ${found.size}`);
for (const match of source.matchAll(/\^\\\/api\\\/v0\\\/([^^$]*)\$?/g)) found.set(`re:${match[1]}`, `regex ${match[1]}`);

// Method-aware inventory ids look like `GET /api/v0/...`; keep only the path part and normalise the `:param` forms the
// audit uses for `[^/]+` captures, so the two sets are comparable.
const inventory = JSON.parse(readFileSync(resolve(worktree, 'evidence/raw/mission-book/CEX-790/current/capability-inventory.json'), 'utf8'));
const auditPaths = new Set();
for (const item of inventory.items) {
  const match = /^(GET|POST|PATCH|PUT|DELETE) (\/api\/v0\/\S+)$/.exec(item.id);
  if (!match) continue;
  auditPaths.add(match[2].replace(/\/:[^/]+/g, '/*'));
}
const normalise = value => value.replace(/\/$/, '').replace(/\/:[^/]+/g, '/*');

const sourcePaths = new Set();
for (const [key] of found) {
  if (key.startsWith('re:')) { sourcePaths.add(normalise('/api/v0/' + key.slice(3).replace(/\\\//g, '/').replace(/\\\./g, '.').replace(/\(\?<[^>]+>\)/g, '').replace(/\[[^\]]+\]\+?/g, '*'))); continue; }
  sourcePaths.add(normalise(key.replace(/\*$/, '')));
}

const missingFromAudit = [...sourcePaths].filter(p => p.startsWith('/api/v0/') && !auditPaths.has(p) && ![...auditPaths].some(a => p.startsWith(a.replace(/\/\*$/, ''))));
const invented = [...auditPaths].filter(p => !sourcePaths.has(p) && ![...sourcePaths].some(s => p.startsWith(s.replace(/\/\*$/, ''))));

console.log(`dispatch-chain route patterns found in source : ${sourcePaths.size}`);
console.log(`method-specific routes declared by the audit  : ${auditPaths.size}`);
console.log(`audit sources.gateway_route                   : ${inventory.sources.gateway_route}`);
console.log(`\nin source but not in the audit (${missingFromAudit.length}):`);
for (const path of missingFromAudit) console.log(`  ${path}`);
console.log(`\nin the audit but not in source (${invented.length}):`);
for (const path of invented) console.log(`  ${path}`);
console.log('\nNOTE  set-difference only. A crude extractor cannot prove exhaustiveness in either direction; it can only fail to falsify it.');
