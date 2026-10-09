import { readdirSync, readFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

// `lastmod` for the sitemap: the `lastUpdated` of a page, else its `date`, read from the frontmatter of the content
// files. A page with neither gets no `lastmod`: the build date would say "changed today" on every deploy.

/** The `lastUpdated` (else `date`) of a frontmatter block, as `YYYY-MM-DD`, or undefined. */
export function lastmodOf(source) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return undefined;
	const found = {};
	for (const line of match[1].split(/\r?\n/)) {
		const m = line.match(/^(lastUpdated|date):\s*['"]?(\d{4}-\d{2}-\d{2})/);
		if (m) found[m[1]] = m[2];
	}
	return found.lastUpdated ?? found.date;
}

/** The page path of a content file: `guide/ai/index.mdx` is `/guide/ai/`, `articles/x.mdx` is `/articles/x/`. */
export function pathOf(file, collection) {
	const parts = file
		.split(sep)
		.join('/')
		.replace(/\.mdx?$/, '')
		.split('/');
	if (parts.at(-1) === 'index') parts.pop();
	return `/${[...(collection === 'articles' ? ['articles'] : []), ...parts].join('/')}/`.replace(/\/\/$/, '/');
}

function* walk(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) yield* walk(path);
		else if (/\.mdx?$/.test(entry.name)) yield path;
	}
}

/** Map of page path to `YYYY-MM-DD`, from `src/content/docs` and `src/content/articles`. */
export function lastmodMap(root = 'src/content') {
	const map = new Map();
	for (const collection of ['docs', 'articles']) {
		const dir = join(root, collection);
		for (const file of walk(dir)) {
			const date = lastmodOf(readFileSync(file, 'utf8'));
			if (date) map.set(pathOf(relative(dir, file), collection), date);
		}
	}
	return map;
}

/** The `serialize` callback of `@astrojs/sitemap`. */
export function withLastmod(map = lastmodMap()) {
	return (item) => {
		const date = map.get(new URL(item.url).pathname.replace(/\/?$/, '/'));
		if (date) item.lastmod = new Date(`${date}T00:00:00Z`).toISOString();
		return item;
	};
}
