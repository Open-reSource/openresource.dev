import { getCollection } from 'astro:content';
import { OGImageRoute } from 'astro-og-canvas';

export const prerender = true;

const entries = await getCollection('docs');

const pages = Object.fromEntries(entries.map(({ data, id }) => [id, { data }]));

/*
export interface FontConfig {
  /** RGB text color. Default: `[255, 255, 255]` /
  color?: RGBColor;

  /** Font size. Title default is `70`, description default is `40`. /
  size?: number;

  /** Font weight. Make sure you provide a URL for the matching font weight. /
  weight?: Exclude<keyof CanvasKit['FontWeight'], 'values'>;

  /** Line height, a.k.a. leading. /
  lineHeight?: number;

  /**
   * Font families to use to render this text. These must be loaded using the
   * top-level `fonts` config option.
   *
   * Similar to CSS, this operates as a “font stack”. The first family in the
   * list will be preferred with next entries used if a glyph isn’t in earlier
   * families. Useful for providing fallbacks for different alphabets etc.
   *
   * Example: `['Noto Sans', 'Noto Sans Arabic']`
   /
  families?: string[];
}
*/

/*
export interface OGImageOptions {
  /** Optional site logo. Displayed at the top of the card. /
  logo?: {
    /** Path to the logo image file, e.g. `'./src/logo.png'` /
    path: string;

    /**
     * Size to display logo at.
     * - `undefined` — Use original image file dimensions. (Default)
     * - `[width]` — Resize to the specified width, height will be
     *               resized proportionally.
     * - `[width, height]` — Resized to the specified width and height.
     /
    size?: [width?: number, height?: number];
  };

  /**
   * Array of `[R, G, B]` colors to use in the background gradient,
   * e.g. `[[255, 0, 0], [0, 0, 255]]` (red to blue).
   * For a solid color, only include a single color, e.g. `[[0, 0, 0]]`
   /
  bgGradient?: RGBColor[];

  /** Border config. Highlights a single edge of the image. /
  border?: {
    /** RGB border color, e.g. `[0, 255, 0]`. /
    color?: RGBColor;

    /** Border width. Default: `0`. /
    width?: number;

    /** Side of the image to draw the border on. Inline start/end respects writing direction. /
    side?: LogicalSide;
  };

  /** Optional background image. /
  bgImage?: {
    /** Path to the background image file, e.g. `'./src/background.png'`. /
    path: string;

    /** How the background image should resize to fit the container. (Default: `'none'`) /
    fit?: 'cover' | 'contain' | 'none' | 'fill';

    /**
     * How the background image should be positioned in the container. (Default: `'center'`)
     *
     * The value is either a shorthand for both block and inline directions, e.g. `'center'`,
     * or a tuple of `[blockPosition, inlinePosition]`, e.g. `['end', 'center']`.
     /
    position?: LogicalPosition | [LogicalPosition, LogicalPosition];
  };

  /** Amount of padding between the image edge and text. Default: `60`. /
  padding?: number;

  /** Font styles. /
  font?: {
    /** Font style for the page title. /
    title?: FontConfig;

    /** Font style for the page description. /
    description?: FontConfig;
  };

  /**
   * Array of font URLs or file paths to load and use when rendering text,
   * e.g. `['./src/fonts/local-font.ttf', 'https://example.com/cdn/remote-font.ttf']`
   * Local font paths are specified relative to your project’s root.
   /
  fonts?: string[];
}
*/

export const { getStaticPaths, GET } = OGImageRoute({
	pages,
	param: 'slug',
	getImageOptions: (_path, page: (typeof pages)[number]) => {
		return {
			title: page.data.title,
			description: page.data.description,
			logo: {
				path: './src/og-logo.png',
				size: [200],
			},
			bgImage: {
				path: './src/og-background.png',
			},
			font: {
				title: {
					color: [255, 255, 255],
					weight: 'Bold',
					families: ['Inter Variable'],
				},
				description: {
					color: [255, 255, 255],
					families: ['Inter Variable'],
				},
			},
			fonts: [
				'https://cdn.jsdelivr.net/fontsource/fonts/inter:vf@latest/latin-wght-normal.woff2'
			]
		};
	},
});
