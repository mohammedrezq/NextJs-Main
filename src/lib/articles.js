import { getApolloClient } from 'lib/apollo-client';

import { sortObjectsByDate } from './datetime';
import { updateUserAvatar } from 'lib/users';

import {
  QUERY_ALL_ARTICLES,
  QUERY_ARTICLES_BY_AUTHOR_SLUG,
  QUERY_ARTICLES_BY_CATEGORY_ID,
  QUERY_ARTICLE_SEO_BY_SLUG,
  QUERY_ARTICLE_BY_SLUG,
} from 'data/articles';

/**
 * Articles Path: articlePathBySlug
 */

export const articlePathBySlug = (slug) => {
  return `article/${slug}`;
};

/**
 * Get Article By Slug: getArticleBySlug
 */

export const getArticleBySlug = async (slug) => {
  const apolloClient = getApolloClient();
  const apiHost = new URL(process.env.WORDPRESS_GRAPHQL_ENDPOINT).host;

  let articleData;
  let seoData;

  try {
    articleData = await apolloClient.query({
      query: QUERY_ARTICLE_BY_SLUG,
      variables: {
        slug,
      },
    });
  } catch (err) {
    console.log(`[articles][getArticleBySlug] Failed to query post data: ${err.message}`);
    throw err;
  }

  const article = [articleData?.data.article].map(mapArticleData)[0];

  return {
      article
  }
};

export const getAllArticles = async () => {
  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: QUERY_ALL_ARTICLES,
  });

  const articles = data?.data.articles.edges.map(({ node = {} }) => node);

  return {
    articles: Array.isArray(articles) && articles.map(mapArticleData),
  };
};

/**
 *
 * @param {count} getRecentArticles
 * @returns Recent Articles
 */

export const getRecentArticles = async ({ count }) => {
  const { articles } = await getAllArticles();

  const sorted = sortObjectsByDate(articles);
  return {
    articles: sorted.slice(0, count),
  };
};

/**
 *
 * @param {excerpt} article
 * @returns Sanitized Excerpt Of Articles
 */

export const sanitizeExcerptArticle = (excerpt) => {
  if (typeof excerpt !== 'string') {
    throw new Error(`Failed to sanitize excerpt: invalid type ${typeof excerpt}`);
  }

  let sanitized = excerpt;

  sanitized = sanitized.replace(/\s?\[&hellip;\]/, '&hellip;');

  // If after the above replacement, the ellipsis includes 4 dots, it's
  // the end of a setence

  sanitized = sanitized.replace('....', '.');
  sanitized = sanitized.replace('.&hellip;', '.');

  // If the theme is including a "Continue..." link, remove it

  sanitized = sanitized.replace(/\w*<a class="more-link".*<\/a>/, '');

  return sanitized;

};

/**
 * mapArticleData
 */

export function mapArticleData(article = {}) {
  const data = { ...article };

  // Clean up the author object to avoid someone having to look an extra
  // level deeper into the node

  if (data.author) {
    data.author = {
      ...data.author.node,
    };
  }

  // The URL by default that comes from Gravatar / WordPress is not a secure
  // URL. This ends up redirecting to https, but it gives mixed content warnings
  // as the HTML shows it as http. Replace the url to avoid those warnings
  // and provide a secure URL by default

  if (data.author?.avatar) {
    data.author.avatar = updateUserAvatar(data.author.avatar);
  }

  // Clean up the categories to make them more easy to access

  if (data.categories) {
    data.categories = data.categories.edges.map(({ node }) => {
      return {
        ...node,
      };
    });
  }

  // Clean up the featured image to make them more easy to access

  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node;
  }

  return data;
}
