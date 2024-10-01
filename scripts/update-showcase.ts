// This script is based on the one from Astro:
// https://github.com/withastro/astro.build/blob/main/scripts/update-showcase.mjs#L48

import * as dotenv from 'dotenv';

import { ShowcaseScraper } from './libs/showcaseScrapper';

dotenv.config();

const scraper = new ShowcaseScraper('Open-reSource', 'openresource.dev', 3, [
	'https://user-images.githubusercontent.com',
	'https://camo.githubusercontent.com',
	'https://openresource.dev',
	'https://www.openresource.dev',
]);

await scraper.run();
