import { getCollection } from 'astro:content'
import { OGImageRoute } from 'astro-og-canvas'

export const prerender = true;

const entries = await getCollection('docs')

const pages = Object.fromEntries(entries.map(({ data, id }) => [id, { data }]))

export const { getStaticPaths, GET } = OGImageRoute({
  pages,
  param: 'slug',
  getImageOptions: (_path, page: (typeof pages)[number]) => {
    return {
      title: page.data.title,
      description: page.data.description,
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
      }
    }
  },
})
