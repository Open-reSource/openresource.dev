// Screenshots for the guide and articles, taken the same way every time: 1440×900 at 2×, no browser chrome, always
// dark, optional boxes around the elements to look at, saved at 1440px wide max in public/images/.
//
//   npm run shot -- <url> --out <slug>-<n> [--clip <selector> [--margin <px>]] [--box <selector>]... [--wait <ms>]
//
// Always dark: the page gets `prefers-color-scheme: dark`, and Chromium's auto dark mode darkens the pages that have no
// dark theme of their own (pages that do, like GitHub, keep theirs). --box draws a rounded 3px rectangle in brand gold
// around each match, numbered when there are several, on the image after capture. GH_SESSION (the value of GitHub's
// `user_session` cookie) signs the page in, for GitHub pages that need an account. --margin keeps that many pixels of the
// page around the clip, so a box on an element flush with the clip's edge keeps its number, and captures from the full page,
// so a sticky header doesn't cover a clip taller than the viewport. The file is a PNG, or a WebP when the PNG would be over 300 KB.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from 'playwright';
import sharp from 'sharp';

const { values, positionals } = parseArgs({
	allowPositionals: true,
	options: {
		out: { type: 'string' },
		clip: { type: 'string' },
		margin: { type: 'string', default: '0' },
		box: { type: 'string', multiple: true, default: [] },
		wait: { type: 'string', default: '0' },
	},
});

const [url] = positionals;
if (!url || !values.out) {
	console.error(
		'Usage: npm run shot -- <url> --out <slug>-<n> [--clip <selector> [--margin <px>]] [--box <selector>]... [--wait <ms>]'
	);
	process.exit(1);
}

// Brand gold, 11.8:1 on GitHub's dark background.
const annotation = { color: '#FCC514', ink: '#141416' };

const MAX_WIDTH = 1440;
const MAX_PNG = 300 * 1024;
const dir = path.resolve(import.meta.dirname, '../public/images');

const browser = await chromium.launch({ args: ['--blink-settings=forceDarkModeEnabled=true'] });
try {
	const context = await browser.newContext({
		viewport: { width: 1440, height: 900 },
		deviceScaleFactor: 2,
		colorScheme: 'dark',
	});
	if (process.env.GH_SESSION) {
		await context.addCookies([
			{
				name: 'user_session',
				value: process.env.GH_SESSION,
				domain: 'github.com',
				path: '/',
				httpOnly: true,
				secure: true,
			},
		]);
	}
	const page = await context.newPage();
	await page.goto(url, { waitUntil: 'networkidle' });
	await page.waitForTimeout(Number(values.wait));

	// Boxes are drawn on the image, not in the page: Chromium's auto dark mode would recolor anything added to the page.
	const clip = values.clip ? page.locator(values.clip).first() : undefined;
	if (clip) await clip.scrollIntoViewIfNeeded();
	const margin = Number(values.margin);
	const bounds = clip && (await clip.boundingBox());
	const origin = bounds ? { x: bounds.x - margin, y: bounds.y - margin } : { x: 0, y: 0 };
	const boxes = (await Promise.all(values.box.map((selector) => page.locator(selector).all()))).flat();
	const rects = (await Promise.all(boxes.map((box) => box.boundingBox()))).filter((rect) => rect !== null);
	const scroll = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }));
	const capture =
		bounds && margin > 0
			? await page.screenshot({
					fullPage: true,
					clip: {
						x: origin.x + scroll.x,
						y: origin.y + scroll.y,
						width: bounds.width + margin * 2,
						height: bounds.height + margin * 2,
					},
				})
			: clip
				? await clip.screenshot()
				: await page.screenshot();

	const { width: pixels = 0, height: rows = 0 } = await sharp(capture).metadata();
	const { color, ink } = annotation;
	const pad = 4;
	const stroke = 3;
	const marks = rects.map((rect, i) => {
		const x = rect.x - origin.x - pad;
		const y = rect.y - origin.y - pad;
		const frame = `<rect x="${x + stroke / 2}" y="${y + stroke / 2}" width="${rect.width + pad * 2 - stroke}" height="${rect.height + pad * 2 - stroke}" rx="8" fill="none" stroke="${color}" stroke-width="${stroke}"/>`;
		const badge =
			rects.length > 1
				? `<circle cx="${x - 2}" cy="${y - 2}" r="12" fill="${color}"/><text x="${x - 2}" y="${y - 2}" dy="0.35em" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="13" fill="${ink}">${i + 1}</text>`
				: '';
		return frame + badge;
	});
	const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${pixels}" height="${rows}" viewBox="0 0 ${pixels / 2} ${rows / 2}">${marks.join('')}</svg>`;
	const shot = await sharp(capture)
		.composite([{ input: Buffer.from(overlay) }])
		.png()
		.toBuffer();
	const resized = sharp(shot).resize({ width: MAX_WIDTH, withoutEnlargement: true });
	const png = await resized.clone().png({ compressionLevel: 9 }).toBuffer();
	const [file, data] =
		png.length <= MAX_PNG
			? [`${values.out}.png`, png]
			: [`${values.out}.webp`, await resized.webp({ quality: 88 }).toBuffer()];
	fs.writeFileSync(path.join(dir, file), data);
	const { width, height } = await sharp(data).metadata();
	console.log(`public/images/${file}: ${width}×${height}, ${Math.round(data.length / 1024)} KB`);
} finally {
	await browser.close();
}
