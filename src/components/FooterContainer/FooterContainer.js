import ClassName from 'models/classname';

import styles from './FooterContainer.module.scss';

const FooterContainer = ({ children, className }) => {
  const containerClassName = new ClassName(styles.container);

  containerClassName.addIf(className, className);

  return <div className={containerClassName.toString()}>{children}</div>;
};

export default FooterContainer;
