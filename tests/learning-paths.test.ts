import { describe, expect, test } from 'vitest';

import { isStub, modules } from '../src/guide-modules.mjs';
import { paths } from '../src/learning-paths.mjs';

const chapters = new Set(modules.flatMap(({ dir, pages }) => pages.map((page) => `${dir}/${page}`)));

describe('learning paths', () => {
	test('every chapter of a path is a page of the guide', () => {
		const missing = paths.flatMap(({ id, chapters: list }) =>
			list.filter((chapter) => !chapters.has(chapter)).map((chapter) => `${id}: ${chapter}`)
		);
		expect(missing).toEqual([]);
	});

	test('no path sends the reader to a stub', () => {
		const stubs = paths.flatMap(({ id, chapters: list }) =>
			list
				.filter((chapter) => chapters.has(chapter) && isStub(...(chapter.split('/') as [string, string])))
				.map((chapter) => `${id}: ${chapter}`)
		);
		expect(stubs).toEqual([]);
	});

	test('no chapter appears twice in a path', () => {
		const twice = paths.flatMap(({ id, chapters: list }) =>
			list.filter((chapter, i) => list.indexOf(chapter) !== i).map((chapter) => `${id}: ${chapter}`)
		);
		expect(twice).toEqual([]);
	});

	test('every path has 6 to 10 chapters', () => {
		const sizes = paths
			.filter(({ chapters: list }) => list.length < 6 || list.length > 10)
			.map(({ id, chapters: list }) => `${id}: ${list.length}`);
		expect(sizes).toEqual([]);
	});

	test('ids are unique and URL-safe', () => {
		const ids = paths.map(({ id }) => id);
		expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
		expect(ids.filter((id) => !/^[a-z]+(-[a-z]+)*$/.test(id))).toEqual([]);
	});
});
