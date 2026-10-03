import { describe, expect, test } from 'vitest';

import { TAG_MODULES, modulesOf } from '../src/article-modules.mjs';
import { modules } from '../src/guide-modules.mjs';
import { fileOf, pages } from '../src/related.mjs';

describe('related pages', () => {
	test('every id in `related` is a page', () => {
		const missing = pages().flatMap(({ id, related }) =>
			related.filter((target) => !fileOf(target)).map((t) => `${id} -> ${t}`)
		);
		expect(missing).toEqual([]);
	});

	test('no page lists itself', () => {
		expect(
			pages()
				.filter(({ id, related }) => related.includes(id))
				.map(({ id }) => id)
		).toEqual([]);
	});
});

describe('article tags and modules', () => {
	test('every tag maps to a guide module', () => {
		const dirs = modules.map(({ dir }) => dir);
		expect(Object.values(TAG_MODULES).filter((dir) => !dirs.includes(dir))).toEqual([]);
	});

	test('every mapped tag is used by an article', () => {
		const used = new Set(pages().flatMap(({ tags }) => tags));
		expect(Object.keys(TAG_MODULES).filter((tag) => !used.has(tag))).toEqual([]);
	});

	test('modulesOf maps tags to modules once', () => {
		expect(modulesOf(['Funding', 'Sponsors', 'GitHub', 'Community'])).toEqual(['financing', 'maintaining']);
	});
});
