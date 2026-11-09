import { SHELF_ITEMS } from './books.js';
import { AUTHOR_NAME } from './siteConfig.js';
import { HOME_PATH, BLOG_PATH, READING_LIST_PATH, absoluteUrl } from './routes.js';

export const READING_LIST_DESCRIPTION = 'From My Shelf: books and essays that shaped how I think, with a one-line note on each.';

export const READING_LIST_JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `From My Shelf — ${AUTHOR_NAME}`,
    description: READING_LIST_DESCRIPTION,
    url: absoluteUrl(READING_LIST_PATH),
    numberOfItems: SHELF_ITEMS.length,
    itemListElement: SHELF_ITEMS.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': item.url ? 'Article' : 'Book',
        name: item.title,
        author: { '@type': 'Person', name: item.author },
        ...(item.url ? { url: item.url } : {}),
      },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl(HOME_PATH) },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteUrl(BLOG_PATH) },
      { '@type': 'ListItem', position: 3, name: 'Reading List', item: absoluteUrl(READING_LIST_PATH) },
    ],
  },
];