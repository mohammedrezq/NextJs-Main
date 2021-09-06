import Container from 'components/Container';

import styles from './HeaderSingle.module.scss';

const HeaderSingle = ({ children, color }) => {
  return (
    <header style={{backgroundColor: `${color} !important` }} className={styles.header}>
      <Container>{children}</Container>
    </header>
  );
};

export default HeaderSingle;
