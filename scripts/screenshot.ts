// Screenshots for the guide and articles, taken the same way every time: 1440×900 at 2×, no browser chrome, the page's
// dark or light theme, optional boxes around the elements to look at, saved at 1440px wide max in public/images/.
//
//   npm run shot -- <url> --out <slug>-<n> [--clip <selector>] [--box <selector>]... [--theme dark|light] [--wait <ms>]
//
// --box draws a rounded 3px rectangle around each match, numbered when there are several: brand gold on dark UI,
// brand dim cyan on light UI. GH_SESSION (the value of GitHub's `user_session` cookie) signs the page in, for GitHub
// pages that need an account. The file is a PNG, or a WebP when the PNG would be over 300 KB.
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
		box: { type: 'string', multiple: true, default: [] },
		theme: { type: 'string', default: 'dark' },
		wait: { type: 'string', default: '0' },
	},
});

const [url] = positionals;
const theme = values.theme === 'light' ? 'light' : 'dark';
if (!url || !values.out) {
	console.error(
		'Usage: npm run shot -- <url> --out <slug>-<n> [--clip <selector>] [--box <selector>]... [--theme dark|light]'
	);
	process.exit(1);
}

// Brand colors, 3:1 or more on the background of their theme (gold 11.8:1 on GitHub dark, dim cyan 5.0:1 on GitHub light).
const annotation = theme === 'dark' ? { color: '#FCC514', ink: '#141416' } : { color: '#2D7579', ink: '#FFFFFF' };

const MAX_WIDTH = 1440;
const MAX_PNG = 300 * 1024;
const dir = path.resolve(import.meta.dirname, '../public/images');

const browser = await chromium.launch();
try {
	const context = await browser.newContext({
		viewport: { width: 1440, height: 900 },
		deviceScaleFactor: 2,
		colorScheme: theme,
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

	const boxes = (await Promise.all(values.box.map((selector) => page.locator(selector).all()))).flat();
	for (const [i, element] of boxes.entries()) {
		const rect = await element.boundingBox();
		if (!rect) continue;
		await page.evaluate(
			({ rect, n, color, ink }) => {
				const pad = 4;
				const box = document.createElement('div');
				Object.assign(box.style, {
					position: 'absolute',
					left: `${rect.x + window.scrollX - pad}px`,
					top: `${rect.y + window.scrollY - pad}px`,
					width: `${rect.width + pad * 2}px`,
					height: `${rect.height + pad * 2}px`,
					border: `3px solid ${color}`,
					borderRadius: '8px',
					boxSizing: 'border-box',
					pointerEvents: 'none',
					zIndex: '2147483647',
				});
				if (n) {
					const badge = document.createElement('span');
					badge.textContent = String(n);
					Object.assign(badge.style, {
						position: 'absolute',
						left: '-14px',
						top: '-14px',
						width: '24px',
						height: '24px',
						borderRadius: '50%',
						background: color,
						color: ink,
						font: '600 13px/24px system-ui, sans-serif',
						textAlign: 'center',
					});
					box.append(badge);
				}
				document.body.append(box);
			},
			{ rect, n: boxes.length > 1 ? i + 1 : 0, ...annotation }
		);
	}

	const shot = values.clip ? await page.locator(values.clip).first().screenshot() : await page.screenshot();
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
