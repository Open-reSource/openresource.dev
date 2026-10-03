import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

import { zip } from '../src/templates-zip.mjs';

describe('templates zip', () => {
	test('unzip accepts it and extracts the same names and text', () => {
		const files = [
			{ name: 'README.md', text: '# Hello\n' },
			{ name: '.github/ISSUE_TEMPLATE/bug.yml', text: 'name: Bug\n' },
		];
		const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'templates-zip-'));
		try {
			const archive = path.join(dir, 'templates.zip');
			fs.writeFileSync(archive, zip(files));
			execFileSync('unzip', ['-tq', archive]);
			execFileSync('unzip', ['-q', archive, '-d', path.join(dir, 'out')]);
			for (const { name, text } of files) expect(fs.readFileSync(path.join(dir, 'out', name), 'utf8')).toBe(text);
		} finally {
			fs.rmSync(dir, { recursive: true, force: true });
		}
	});
});
