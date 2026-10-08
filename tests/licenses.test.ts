import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';

type License = { id: string; usedBy: string; osi: boolean; osiUrl?: string; textUrl: string };

const licenses: License[] = parse(readFileSync('src/data/licenses.yml', 'utf8'), { schema: 'core' });

describe('licenses table', () => {
	it('has unique SPDX identifiers', () => {
		expect(new Set(licenses.map(({ id }) => id)).size).toBe(licenses.length);
	});

	it('links every text over https, and an OSI page for each approved license only', () => {
		for (const { id, osi, osiUrl, textUrl } of licenses) {
			expect(textUrl, id).toMatch(/^https:\/\//);
			if (osi) expect(osiUrl, id).toMatch(/^https:\/\/opensource\.org\//);
			else expect(osiUrl, id).toBeUndefined();
		}
	});
});
