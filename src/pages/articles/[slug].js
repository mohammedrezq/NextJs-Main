import Link from 'next/link';
import { Helmet } from 'react-helmet';

import { getAllArticles, getArticleBySlug, getRecentArticles, articlePathBySlug } from 'lib/articles';

import { formatDate } from 'lib/datetime';
import { ArticleJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';
import usePageMetadata from 'hooks/use-page-metadata';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Section from 'components/Section';
import Container from 'components/Container';
import Content from 'components/Content';
import Metadata from 'components/Metadata';
import FeaturedImage from 'components/FeaturedImage';

import styles from 'styles/pages/Post.module.scss';
import HeaderSingle from 'components/HeaderSingle';

export default function Article({ article }) {
  const { title, metaTitle, description, content, date, author, categories, modified, featuredImage } = article;

  const { metadata: siteMetadata = {}, homepage } = useSite();

//   if (!article.og) {
//     article.og = {};
//   }

//   article.og.imageUrl = `${homepage}${socialImage}`;
//   article.og.imageSecureUrl = article.og.imageUrl;
//   article.og.imageWidth = 2000;
//   article.og.imageHeight = 1000;

  const { metadata } = usePageMetadata({
    metadata: {
      ...article,
      title: metaTitle,
      description: description || article.og?.description || `Read more about ${title}`,
    },
  });

  if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
    metadata.title = `${title} - ${siteMetadata.title}`;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  const metadataOptions = {
    compactCategories: false,
  };

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  return (
    <Layout>
      <Helmet {...helmetSettings} />

      <ArticleJsonLd post={article} siteTitle={siteMetadata.title} />

      <HeaderSingle color="#fff0e1">
        {featuredImage && (
          <FeaturedImage
            {...featuredImage}
            src={featuredImage.sourceUrl}
            dangerouslySetInnerHTML={featuredImage.caption}
          />
        )}
        <h1
          className={styles.title}
          dangerouslySetInnerHTML={{
            __html: title,
          }}
        />
        <Metadata
          className={styles.postMetadata}
          date={date}
          author={author}
          categories={categories}
          options={metadataOptions}
        />
      </HeaderSingle>

      <Content>
        <Section>
          <Container>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </Container>
        </Section>
      </Content>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { article } = await getArticleBySlug(params?.slug);

  return {
    props: {
      article,
    },
  };
}

export async function getStaticPaths() {
  const { articles } = await getAllArticles();

  const paths = articles.map((article) => {
    const { slug } = article;
    return {
      params: {
        slug,
      },
    };
  });

  return {
    paths,
    fallback: false,
  };
}
