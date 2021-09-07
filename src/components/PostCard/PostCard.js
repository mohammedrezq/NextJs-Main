import Link from 'next/link';
import Image from 'next/image';

import { postPathBySlug, sanitizeExcerpt } from 'lib/posts';

import Metadata from 'components/Metadata';

import { FaMapPin } from 'react-icons/fa';
import styles from './PostCard.module.scss';
import FeaturedImagePost from 'components/FeaturedImage';

const PostCard = ({ post, options = {} }) => {
  const { featuredImage, title, excerpt, slug, date, author, categories, isSticky = false } = post;
  const { excludeMetadata = [] } = options;

  const metadata = {};

  if (!excludeMetadata.includes('author')) {
    metadata.author = author;
  }

  if (!excludeMetadata.includes('date')) {
    metadata.date = date;
  }

  if (!excludeMetadata.includes('categories')) {
    metadata.categories = categories;
  }

  let postCardStyle = styles.postCard;

  if (isSticky) {
    postCardStyle = `${postCardStyle} ${styles.postCardSticky}`;
  }

  const theFeaturedImage = featuredImage
    ? featuredImage?.sourceUrl
    : 'http://localhost/newsite/wp-content/uploads/2021/09/5dc6e957-1031-36ee-8d75-a63547300b33.jpg';
  // const theFeaturedImageAlt = featuredImage.altText;

  return (
    <div className={postCardStyle}>
      <Link href={postPathBySlug(slug)}>
          <a>
      <div className={styles.featuredImageContainer}>
        <Image
          width="350"
          height="250"
          layout="responsive"
          src={theFeaturedImage}
          loading="lazy"
          blurDataURL="base64"
          placeholder="blur"
        />
      </div></a></Link>
      <div className={styles.headerPostCard}>
        {isSticky && <FaMapPin aria-label="Sticky Post" />}
        <Link href={postPathBySlug(slug)}>
          <a className={styles.postCardTitleLink}>
            <h3
              className={styles.postCardTitle}
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
          </a>
        </Link>
        <Metadata className={styles.postCardMetadata} {...metadata} />
      </div>
      {excerpt && (
        <div
          className={styles.postCardContent}
          dangerouslySetInnerHTML={{
            __html: sanitizeExcerpt(excerpt),
          }}
        />
      )}
    </div>
  );
};

export default PostCard;
