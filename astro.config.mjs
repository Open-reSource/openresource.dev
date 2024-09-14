import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import vercel from "@astrojs/vercel/serverless";
import starlightBlog from "starlight-blog";
import starlightLinksValidator from "starlight-links-validator";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
  site: "https://openresource.dev",
  vite: {
    define: {
      "import.meta.env.PUBLIC_VERCEL_ANALYTICS_ID": JSON.stringify(
        process.env.VERCEL_ANALYTICS_ID
      ),
    },
  },
  redirects: {
    '/books': '/resources/books',
    '/events': '/resources/events',
    '/open-sourcerers': '/resources/open-sourcerers',
    '/podcasts': '/resources/podcasts',
    '/rss.xml': '/articles/rss.xml',
  },
  integrations: [
    starlight({
      components: {
        Footer: "./src/components/Footer.astro",
        Head: "./src/components/Head.astro",
        PageTitle: "./src/components/PageTitleThenReadingTime.astro",
        Pagination: "./src/components/SupportThenPagination.astro",
        Header: "./src/components/Header.astro",
      },
      plugins: [
        starlightLinksValidator({
          exclude: ["/articles"],
        }),
        starlightBlog({
          title: "Articles",
          prefix: "articles",
          authors: {
            julien: {
              name: "Julien Déramond",
              title: "Open {re}Source • Bootstrap • Orange",
              picture: "https://avatars.githubusercontent.com/u/17381666?s=100",
              url: "https://github.com/julien-deramond/",
            },
          },
        }),
      ],
      title: "Open {re}Source",
      favicon: "/favicon.ico",
      head: [
        {
          tag: 'link',
          attrs: {
            rel: 'apple-touch-icon',
            href: '/apple-touch-icon.png',
            size: '180x180'
          }
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon-32x32.png',
            size: '32x32'
          }
        },
        {
          tag: 'link',
          attrs: {
            rel: 'icon',
            type: 'image/png',
            href: '/favicon-16x16.png',
            size: '16x16'
          }
        },
        {
          tag: 'link',
          attrs: {
            rel: 'manifest',
            href: '/site.webmanifest'
          }
        }
      ],
      logo: {
        light: "./src/assets/logo.svg",
        dark: "./src/assets/logo-dark.svg",
        replacesTitle: true,
      },
      editLink: {
        baseUrl: "https://github.com/Open-reSource/openresource.dev/edit/main/",
      },
      social: {
        github: "https://github.com/Open-reSource/openresource.dev",
        discord: "https://discord.gg/fpUDwEMGwE",
        "x.com": "https://x.com/open_resource",
        linkedin: "https://linkedin.com/company/open-re-source/",
        mastodon: "https://fosstodon.org/@openresource",
        blueSky: "https://bsky.app/profile/openresource.bsky.social",
        threads: "https://www.threads.net/@openresource",
      },
      customCss: ["./src/styles/custom.css"],
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
      },
      sidebar: [
        {
          label: "Guide",
          items: [
            {
              label: "Introduction",
              slug: "guide",
            },
            {
              label: "What Is Open Source?",
              collapsed: false,
              items: [
                {
                  label: "Introduction",
                  slug: "guide/what-is-open-source",
                },
                {
                  slug: "guide/what-is-open-source/definition-of-open-source",
                },
                {
                  slug: "guide/what-is-open-source/brief-history-of-open-source",
                },
                {
                  slug: "guide/what-is-open-source/the-significance-of-open-source",
                },
                {
                  slug: "guide/what-is-open-source/examples-of-successful-open-source-projects",
                },
                {
                  slug: "guide/what-is-open-source/types-of-open-source-projects",
                },
                {
                  slug: "guide/what-is-open-source/types-of-open-source-software-projects",
                },
                {
                  slug: "guide/what-is-open-source/benefits-of-open-source",
                },
              ],
            },
            {
              label: "Getting Started",
              collapsed: true,
              items: [
                {
                  label: "Introduction",
                  slug: "guide/getting-started-with-open-source",
                },
                {
                  slug: "guide/getting-started-with-open-source/source-code-hosting-platforms",
                },
                {
                  slug: "guide/getting-started-with-open-source/finding-open-source-projects",
                },
              ],
            },
            {
              label: "Contributing",
              collapsed: true,
              items: [
                {
                  label: "Introduction",
                  slug: "guide/contributing-to-open-source-projects",
                },
                {
                  slug: "guide/contributing-to-open-source-projects/finding-open-source-projects",
                },
                {
                  slug: "guide/contributing-to-open-source-projects/contributing-to-open-source",
                },
                {
                  slug: "guide/contributing-to-open-source-projects/getting-involved-in-the-open-source-community",
                },
                {
                  slug: "guide/contributing-to-open-source-projects/building-a-portfolio-with-open-source-contributions",
                },
                {
                  slug: "guide/contributing-to-open-source-projects/overcoming-challenges-in-open-source-contributions",
                },
              ],
            },
            {
              label: "Creating",
              collapsed: true,
              items: [
                {
									label: "Introduction",
                  slug: "guide/creating-your-own-open-source-project",
                },
                {
                  slug: "guide/creating-your-own-open-source-project/choosing-a-project-idea",
                },
                {
                  slug: "guide/creating-your-own-open-source-project/planning-your-project",
                },
                {
                  slug: "guide/creating-your-own-open-source-project/creating-your-project",
                },
                {
                  slug: "guide/creating-your-own-open-source-project/legal-considerations",
                },
                {
                  slug: "guide/creating-your-own-open-source-project/developing-your-project",
                },
                {
                  slug: "guide/creating-your-own-open-source-project/building-and-engaging-your-community",
                },
                {
									slug: "guide/creating-your-own-open-source-project/contributing-your-project-to-the-open-source-community",
                  badge: "Coming soon",
                },
              ],
            },
            {
              label: "Maintaining",
              collapsed: true,
              items: [
                {
                  label: "Introduction",
                  slug: "guide/maintaining-open-source-projects",
                },
                {
                  slug: "guide/maintaining-open-source-projects/introduction-to-open-source-project-maintenance",
                },
                {
									slug: "guide/maintaining-open-source-projects/managing-contributions-and-community-engagement",
									badge: "Coming soon",
                },
                {
									slug: "guide/maintaining-open-source-projects/managing-project-dependencies",
									badge: "Coming soon",
                },
                {
                  slug: "guide/maintaining-open-source-projects/fostering-a-strong-and-inclusive-community",
                },
                {
                  slug: "guide/maintaining-open-source-projects/ensuring-project-sustainability",
									badge: "Coming soon",
                },
              ],
            },
            {
              label: "Promoting",
              collapsed: true,
              items: [
                {
                  label: "Introduction",
                  slug: "guide/promoting-open-source-projects",
                },
                {
                  slug: "guide/promoting-open-source-projects/introduction-to-project-promotion",
                },
                {
                  slug: "guide/promoting-open-source-projects/building-a-strong-project-identity",
                },
                {
                  slug: "guide/promoting-open-source-projects/crafting-an-engaging-project-website",
                },
              ],
            },
            {
              label: "Financing",
              collapsed: true,
              items: [
                {
                  label: "Introduction",
                  slug: "guide/financing-open-source-projects",
                },
                {
                  slug: "guide/financing-open-source-projects/importance-and-challenges-of-financing-open-source-projects",
                },
                {
                  slug: "guide/financing-open-source-projects/understanding-funding-models",
                },
                {
                  slug: "guide/financing-open-source-projects/effective-fundraising-strategies",
                },
                {
                  slug: "guide/financing-open-source-projects/resource-allocation-and-budgeting",
									badge: "Coming soon",
                },
                {
                  slug: "guide/financing-open-source-projects/fostering-a-sustainable-ecosystem",
									badge: "Coming soon",
                },
                {
                  slug: "guide/financing-open-source-projects/transparency-accountability-and-community-involvement",
									badge: "Coming soon",
                },
              ],
            },
          ],
        },
        {
          label: "Resources",
          autogenerate: { directory: "resources" },
        },
        {
          label: "Articles",
          link: "/articles",
        },
      ],
    }),
  ],
});
