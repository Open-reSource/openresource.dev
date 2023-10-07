import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import vercel from '@astrojs/vercel/serverless';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import { h } from 'hastscript';

const AnchorLinkIcon = h(
	'span',
	{ ariaHidden: 'true', class: 'anchor-icon grid items-center' },
	h(
		'svg',
		{
			width: 16,
			height: 16,
			viewBox: '0 0 16 16',
			xlmns: 'http://www.w3.org/2000/svg',
      fill: 'currentcolor',
		},
		h('path', {
			d: 'M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z',
		}),
    h('path', {
			d: 'M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z',
		})
	)
);

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    mdx({
      optimize: true,
    })
  ],
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true
    },
    speedInsights: {
      enabled: true
    }
  }),
  site: 'https://openresource.dev',
  // used for sitemap
  vite: {
    define: {
      'import.meta.env.PUBLIC_VERCEL_ANALYTICS_ID': JSON.stringify(process.env.VERCEL_ANALYTICS_ID)
    }
  },
  markdown: {
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          properties: { class: 'anchor-link' },
          behavior: 'after',
          group: () => h('div', { tabIndex: -1, class: "heading-wrapper" }),
          content: (heading) => [
            AnchorLinkIcon,
            h(
              'span',
              { 'is:raw': true, class: 'sr-only' },
              heading?.children[0]?.value
            )
          ],
        }
      ]
    ]
  }
});