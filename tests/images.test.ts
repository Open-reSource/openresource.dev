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
const LIGHT = 128;

// Each file is decoded once, in parallel, and the three tests share the result (decoding them one after the other
// took close to vitest's 5 s default). The explicit timeout keeps a growing folder from turning main red.
const TIMEOUT = 30_000;
const analyses = new Map<string, Promise<{ width: number; brightness: number }>>();
const analyze = (name: string) => {
	let analysis = analyses.get(name);
	if (!analysis) {
		const image = sharp(path.join(dir, name));
		analysis = Promise.all([image.metadata(), image.stats()]).then(([{ width = 0 }, { channels }]) => ({
			width,
			brightness: Math.round(channels.slice(0, 3).reduce((sum, { mean }) => sum + mean, 0) / 3),
		}));
		analyses.set(name, analysis);
	}
	return analysis;
};

test(
	'images in public/images follow the size conventions',
	async () => {
		const problems = (
			await Promise.all(
				images.map(async (name) => {
					const found: string[] = [];
					const size = fs.statSync(path.join(dir, name)).size;
					const { width } = await analyze(name);
					if (width > 1440) found.push(`${name}: ${width}px wide (max 1440)`);
					if (size > 1024 * KB) found.push(`${name}: ${Math.round(size / KB)} KB (max 1 MB)`);
					if (/\.png$/i.test(name) && size > 300 * KB)
						found.push(`${name}: ${Math.round(size / KB)} KB PNG (over 300 KB: use WebP)`);
					return found;
				})
			)
		).flat();
		expect(problems).toEqual([]);
	},
	TIMEOUT
);

test(
	'screenshots are dark',
	async () => {
		const light = (
			await Promise.all(
				images
					.filter((name) => !lightBaseline.includes(name))
					.map(async (name) => {
						const { brightness } = await analyze(name);
						return brightness > LIGHT ? `${name}: mean brightness ${brightness}/255, retake it with npm run shot` : '';
					})
			)
		).filter(Boolean);
		expect(light).toEqual([]);
	},
	TIMEOUT
);

test(
	'the light baseline only lists light images that still exist',
	async () => {
		const stale = (
			await Promise.all(
				lightBaseline.map(async (name) => {
					if (!images.includes(name)) return `${name}: gone, remove it from tests/images.baseline.json`;
					const { brightness } = await analyze(name);
					return brightness <= LIGHT ? `${name}: now dark, remove it from tests/images.baseline.json` : '';
				})
			)
		).filter(Boolean);
		expect(stale).toEqual([]);
	},
	TIMEOUT
);
