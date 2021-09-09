import Dropdown from 'components/Dropdown';
import styles from './NavMenu.module.scss';

const NavMenu = () => {
  return (
    <div className={styles.NavMenu}>
      <Dropdown />
    </div>
  );
};

export default NavMenu;
