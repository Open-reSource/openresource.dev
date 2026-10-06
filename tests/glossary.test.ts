import fs from 'node:fs';
import { describe, expect, test } from 'vitest';

import { glossary } from '../src/glossary.mjs';

const docs = new URL('../src/content/docs/', import.meta.url);
const file = (id: string) =>
	['.mdx', '.md', '/index.mdx', '/index.md'].map((ext) => new URL(`${id}${ext}`, docs)).find(fs.existsSync);

const content = new URL('../src/content/', import.meta.url);
const pages = fs
	.readdirSync(content, { recursive: true, encoding: 'utf8' })
	.filter((name) => name.endsWith('.mdx'))
	.map((name) => ({ name, body: fs.readFileSync(new URL(name, content), 'utf8') }));

// The anchor a heading gets (GitHub's slug: lowercase, punctuation dropped, spaces to hyphens, repeats numbered).
const anchors = (body: string) => {
	const seen = new Map<string, number>();
	return [...body.matchAll(/^#{1,6} +(.+)$/gm)].map(([, heading]) => {
		const slug = heading
			.replace(/`/g, '')
			.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
			.replace(/[*_]/g, '')
			.toLowerCase()
			.replace(/[^\p{L}\p{N}\s-]/gu, '')
			.replace(/\s/g, '-');
		const count = seen.get(slug) ?? 0;
		seen.set(slug, count + 1);
		return count ? `${slug}-${count}` : slug;
	});
};

const sentences = (text: string) => text.replace(/`[^`]*`/g, 'code').match(/[^.!?]+[.!?]+(?=\s|$)/g) ?? [];

describe('glossary', () => {
	test('every id is unique, lowercase and kebab-case, and no term is repeated', () => {
		const ids = glossary.map(({ id }) => id);
		const terms = glossary.map(({ term }) => term.toLowerCase());
		expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
		expect(terms.filter((term, i) => terms.indexOf(term) !== i)).toEqual([]);
		expect(ids.filter((id) => !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toEqual([]);
	});

	test('the list is sorted by term', () => {
		const terms = glossary.map(({ term }) => term);
		expect(terms).toEqual([...terms].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })));
	});

	test('every href is a guide page that exists, and its #anchor is a heading of that page', () => {
		const bad = glossary.flatMap(({ id, href }) => {
			const [path, anchor] = href.split('#');
			if (!path.startsWith('/guide/')) return [`${id}: ${href} is not a guide page`];
			const target = file(path.slice(1));
			if (!target) return [`${id}: ${path} is not a page`];
			if (anchor && !anchors(fs.readFileSync(target, 'utf8')).includes(anchor))
				return [`${id}: no heading #${anchor} in ${path}`];
			return [];
		});
		expect(bad).toEqual([]);
	});

	test('every definition is one to three sentences and under 400 characters', () => {
		const bad = glossary
			.filter(
				({ definition }) =>
					sentences(definition).length < 1 || sentences(definition).length > 3 || definition.length >= 400
			)
			.map(({ id }) => id);
		expect(bad).toEqual([]);
	});

	test('every term has an inbound link from a chapter, and every glossary link points at a term', () => {
		const links = pages.flatMap(({ name, body }) =>
			name.endsWith('guide/glossary.mdx')
				? []
				: [...body.matchAll(/\/guide\/glossary\/#([\w-]+)/g)].map(([, id]) => ({ name, id }))
		);
		const ids = new Set(glossary.map(({ id }) => id));
		expect(links.filter(({ id }) => !ids.has(id)).map(({ name, id }) => `${name}: #${id}`)).toEqual([]);
		const linked = new Set(links.map(({ id }) => id));
		expect(glossary.filter(({ id }) => !linked.has(id)).map(({ id }) => id)).toEqual([]);
	});
});
