import { describe, expect, test } from 'vitest';

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
