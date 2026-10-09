import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, test } from 'vitest';

// Checks the built pages (`npm run build` first): skipped when there is no build.
const root = '.vercel/output/static';
const built = existsSync(join(root, 'sitemap-0.xml'));

function* pages(dir: string): Generator<string> {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name !== 'pagefind') yield* pages(path);
		} else if (entry.name.endsWith('.html') && entry.name !== '404.html') yield path;
	}
}

describe.skipIf(!built)('canonical URLs and sitemap', () => {
	test('every page has one absolute canonical, with a trailing slash, matching its own path', () => {
		const problems: string[] = [];
		for (const file of pages(root)) {
			const html = readFileSync(file, 'utf8');
			const links = [...html.matchAll(/<link\s+rel="canonical"\s+href="([^"]*)"/g)].map((m) => m[1]);
			const path = '/' + file.slice(root.length + 1).replace(/(^|\/)index\.html$/, '$1');
			const expected = `https://openresource.dev${path === '/' ? '/' : path.replace(/\/?$/, '/')}`;
			// Redirect stubs and the like are not content pages.
			if (html.includes('http-equiv="refresh"')) continue;
			if (links.length !== 1) problems.push(`${file}: ${links.length} canonical links`);
			else if (links[0] !== expected) problems.push(`${file}: canonical ${links[0]}, expected ${expected}`);
		}
		expect(problems).toEqual([]);
	});

	test('sitemap URLs are absolute with a trailing slash, unique, and every dated page has a lastmod', () => {
		const xml = readFileSync(join(root, 'sitemap-0.xml'), 'utf8');
		const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
		expect(urls.length).toBeGreaterThan(0);
		expect(new Set(urls).size).toBe(urls.length);
		expect(urls.filter((u) => !u.startsWith('https://openresource.dev/') || !u.endsWith('/'))).toEqual([]);
		expect(xml).toMatch(/<url><loc>https:\/\/openresource\.dev\/guide\/glossary\/<\/loc><lastmod>\d{4}-\d{2}-\d{2}T/);
		expect(xml).not.toContain('/guide/status/');
	});
});
