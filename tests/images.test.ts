import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { expect, test } from 'vitest';

// Screenshot conventions (see the guide's style rules): 1440px wide max, 1 MB max, and a PNG over 300 KB goes WebP.
const dir = path.resolve(__dirname, '../public/images');
const KB = 1024;

test('images in public/images follow the size conventions', async () => {
	const problems: string[] = [];
	for (const name of fs.readdirSync(dir)) {
		if (!/\.(png|jpe?g|webp|gif|avif)$/i.test(name)) continue;
		const file = path.join(dir, name);
		const size = fs.statSync(file).size;
		const { width = 0 } = await sharp(file).metadata();
		if (width > 1440) problems.push(`${name}: ${width}px wide (max 1440)`);
		if (size > 1024 * KB) problems.push(`${name}: ${Math.round(size / KB)} KB (max 1 MB)`);
		if (/\.png$/i.test(name) && size > 300 * KB)
			problems.push(`${name}: ${Math.round(size / KB)} KB PNG (over 300 KB: use WebP)`);
	}
	expect(problems).toEqual([]);
});
