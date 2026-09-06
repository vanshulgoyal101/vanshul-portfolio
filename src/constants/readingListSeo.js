import { SHELF_ITEMS } from './books.js';
import { SITE_URL, AUTHOR_NAME } from './siteConfig.js';

export const READING_LIST_DESCRIPTION = 'From My Shelf: books and essays that shaped how I think, with a one-line note on each.';

export const READING_LIST_JSON_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `From My Shelf — ${AUTHOR_NAME}`,
    description: READING_LIST_DESCRIPTION,
    url: `${SITE_URL}/reading-list`,
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
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Writings', item: `${SITE_URL}/#blog` },
      { '@type': 'ListItem', position: 3, name: 'Reading List', item: `${SITE_URL}/reading-list` },
    ],
  },
];