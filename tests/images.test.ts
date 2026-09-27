import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { expect, test } from 'vitest';

// Screenshot conventions (see the guide's style rules): 1440px wide max, 1 MB max, a PNG over 300 KB goes WebP, and
// always dark. Images taken before the dark rule are listed in images.baseline.json until they're retaken.
const dir = path.resolve(__dirname, '../public/images');
const KB = 1024;
const lightBaseline: string[] = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'images.baseline.json'), 'utf8'));
const images = fs.readdirSync(dir).filter((name) => /\.(png|jpe?g|webp|gif|avif)$/i.test(name));

// Mean of the RGB channels, 0 (black) to 255 (white). A dark UI screenshot sits around 20–60, a light one above 200.
const brightness = async (name: string) => {
	const { channels } = await sharp(path.join(dir, name)).stats();
	return Math.round(channels.slice(0, 3).reduce((sum, { mean }) => sum + mean, 0) / 3);
};
const LIGHT = 128;

test('images in public/images follow the size conventions', async () => {
	const problems: string[] = [];
	for (const name of images) {
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

test('screenshots are dark', async () => {
	const light: string[] = [];
	for (const name of images) {
		if (lightBaseline.includes(name)) continue;
		const mean = await brightness(name);
		if (mean > LIGHT) light.push(`${name}: mean brightness ${mean}/255, retake it with npm run shot`);
	}
	expect(light).toEqual([]);
});

test('the light baseline only lists light images that still exist', async () => {
	const stale: string[] = [];
	for (const name of lightBaseline) {
		if (!images.includes(name)) stale.push(`${name}: gone, remove it from tests/images.baseline.json`);
		else if ((await brightness(name)) <= LIGHT)
			stale.push(`${name}: now dark, remove it from tests/images.baseline.json`);
	}
	expect(stale).toEqual([]);
});
