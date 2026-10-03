// Warns about the links between chapters and articles: a `related` target that doesn't exist, and a chapter that no
// article is related to, either way. Exits 1 only on a missing target (tests/related.test.ts runs the same check).
//
//   npm run graph
import { modules } from '../src/guide-modules.mjs';
import { fileOf, pages } from '../src/related.mjs';

const all = pages();
const missing = all.flatMap(({ id, related }) =>
	related.filter((target) => !fileOf(target)).map((target) => ({ id, target }))
);

const chapters = new Set(modules.flatMap(({ dir, pages }) => pages.map((page) => `guide/${dir}/${page}`)));
const alone = all.filter(
	({ id, status, related }) =>
		chapters.has(id) &&
		status === 'complete' &&
		!related.some((target) => target.startsWith('articles/')) &&
		!all.some((page) => page.kind === 'article' && page.related.includes(id))
);

for (const { id, target } of missing) console.warn(`${id}: related "${target}" does not exist`);
for (const { id } of alone) console.warn(`${id}: no related article, and no article points here`);
console.log(`${all.length} pages, ${missing.length} missing targets, ${alone.length} chapters without an article.`);
process.exit(missing.length > 0 ? 1 : 0);
