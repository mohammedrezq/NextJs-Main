import Link from 'next/link';

import useSite from 'hooks/use-site';
import { postPathBySlug } from 'lib/posts';
import { categoryPathBySlug } from 'lib/categories';

import Section from 'components/Section';
import Container from 'components/Container';

import styles from './Footer.module.scss';
import FooterContainer from 'components/FooterContainer';

const Footer = () => {
  const { metadata = {}, recentPosts = [], categories = [] } = useSite();
  const { title } = metadata;

  const hasRecentPosts = Array.isArray(recentPosts) && recentPosts.length > 0;
  const hasRecentCategories = Array.isArray(categories) && categories.length > 0;
  const hasMenu = hasRecentPosts || hasRecentCategories;

  return (
    <footer className={styles.footer}>
      {hasMenu && (
        <Section className={styles.footerMenu}>
          <FooterContainer>
            <ul className={styles.footerMenuColumns}>
              {hasRecentPosts && (
                <li>
                  <Link href="/blog/">
                    <a className={styles.footerMenuTitle}>
                      <strong>آخر المشاركات</strong>
                    </a>
                  </Link>
                  <ul className={styles.footerMenuItems}>
                    {recentPosts.map((post) => {
                      const { id, slug, title } = post;
                      return (
                        <li key={id}>
                          <Link href={postPathBySlug(slug)}>
                            <a>{title}</a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
              {hasRecentCategories && (
                <li>
                  <Link href="/categories/">
                    <a className={styles.footerMenuTitle}>
                      <strong>التصنيفات</strong>
                    </a>
                  </Link>
                  <ul className={styles.footerMenuItems}>
                    {categories.map((category) => {
                      const { id, slug, name } = category;
                      return (
                        <li key={id}>
                          <Link href={categoryPathBySlug(slug)}>
                            <a>{name}</a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              )}
              <li>
                <p className={styles.footerMenuTitle}>
                  <strong>المزيد</strong>
                </p>
                <ul className={styles.footerMenuItems}>
                  <li>
                    <Link href="/feed.xml">
                      <a>RSS</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/sitemap.xml">
                      <a>Sitemap</a>
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </FooterContainer>
        </Section>
      )}

      <Section className={styles.footerLegal}>
        <FooterContainer>
          <p>
            &copy; {new Date().getFullYear()} {title}
          </p>
        </FooterContainer>
      </Section>
    </footer>
  );
};

export default Footer;
