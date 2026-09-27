import fs from 'node:fs';
import { describe, expect, test } from 'vitest';

import { checklistsIn } from '../src/checklists.mjs';

const root = new URL('../src/content/', import.meta.url);
const files = fs
	.readdirSync(root, { recursive: true, encoding: 'utf8' })
	.filter((file) => file.endsWith('.mdx'))
	.map((file) => ({ file, body: fs.readFileSync(new URL(file, root), 'utf8') }));

describe('checklists', () => {
	test('every <Checklist> is in the tested form, so the checklists page picks it up', () => {
		const missed = files.filter(({ body }) => (body.match(/<Checklist\b/g) ?? []).length !== checklistsIn(body).length);
		expect(missed.map(({ file }) => file)).toEqual([]);
	});

	test('no two checklists share an id: it keys the ticks in localStorage', () => {
		const ids = files.flatMap(({ body }) => checklistsIn(body).map(({ id }) => id));
		expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
	});
});
