import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = await getCollection('articles');
  return rss({
    title: 'Open {re}Source',
    description: 'Join open source, learn to create, manage, and contribute to projects with Open {re}Source. Make a difference today by sharing and collaborating. This RSS feed contains all of our articles.',
    site: context.site,
    items: articles.map((article) => ({
      title: article.data.title,
      pubDate: article.data.creationDate,
      description: article.data.description,
      link: `/articles/${article.slug}/`,
    })),
  });
}
