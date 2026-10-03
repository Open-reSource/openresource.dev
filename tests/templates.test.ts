import fs from 'node:fs';
import { describe, expect, test } from 'vitest';

import { templates } from '../src/templates.mjs';

const dir = new URL('../src/templates/', import.meta.url);
const docs = new URL('../src/content/docs/', import.meta.url);

describe('templates', () => {
	test('every template of the gallery has its file, and every file is in the gallery', () => {
		const listed = templates.map(({ file }) => file).sort();
		expect(listed.filter((file) => !fs.existsSync(new URL(file, dir)))).toEqual([]);
		expect(fs.readdirSync(dir).sort()).toEqual(listed);
	});

	test('every template links a chapter that exists', () => {
		const missing = templates.filter(({ chapter }) => !fs.existsSync(new URL(`${chapter}.mdx`, docs)));
		expect(missing.map(({ file }) => file)).toEqual([]);
	});
});
