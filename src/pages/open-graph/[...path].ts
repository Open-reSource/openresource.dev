import { OGImageRoute } from 'astro-og-canvas';

export const prerender = true;

const pages = await import.meta.glob('/src/content/**/*.mdx', { eager: true });

// Convert the glob result to remove the `/src/content` prefix
Object.keys(pages).forEach(path => {
  const newPath = path.replace(/^\/src\/content/, '');
  pages[newPath] = pages[path];
  delete pages[path];
});

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'path',
  // A collection of pages to generate images for.
  pages,
  // For each page, this callback will be used to customize the OpenGraph
  // image. For example, if `pages` was passed a glob like above, you
  // could read values from frontmatter.
  getImageOptions: (path, page) => ({
    title: page.frontmatter.title,
    description: page.frontmatter.description,
    logo: {
      path: './src/docs-logo.png',
    },
		bgGradient: [[255, 255, 255]],
		font: {
			title: {
				color: [0, 0, 0],
				families: [
					'Roboto'
				]
			},
			description: {
				color: [0, 0, 0],
				families: [
					'Roboto'
				]
			}
		},
		fonts: [
			'https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.1/fonts/roboto/Roboto-Regular.ttf'
		]
  }),
});
