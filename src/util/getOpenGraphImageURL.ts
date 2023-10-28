import type { GetStaticPathsOptions, GetStaticPathsResult } from 'astro';
import { getStaticPaths } from '../pages/open-graph/[...path]';

const routes = (await getStaticPaths({} as GetStaticPathsOptions)) as GetStaticPathsResult;

/**
 * Get the path to the Open Graph image for a page
 * @param path Pathname of the page URL.
 * @param isFallback Whether or not this page is displaying fallback content.
 * @returns Path to the Open Graph image if found. Otherwise, `undefined`.
 */
export function getOpenGraphImageURL(path: string, isFallback: boolean): string | undefined {
  let imagePath = path.replace(/^\//, '').replace(/\/$/, '') + '.png';

	if (isFallback) {
		// Replace the language segment with 'en' for fallback pages.
		imagePath = 'en' + imagePath.slice(imagePath.indexOf('/'));
	}

  return '/open-graph/' + imagePath;
}
