import { useState } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { GrClose } from 'react-icons/gr';

import styles from './NavMenuMobile.module.scss';
import DropdownMobile from 'components/DropdownMobile';

const NavMenuMobile = () => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [mobileMenuClose, setMobileMenuClose] = useState(false);

  const mobileMenuActivateHandler = () => {
    // setMobileMenuActive((prevState) =>  !prevState)
    setMobileMenuActive((prevState) => !prevState);
  };

  const mobileMenuCloseHandler = () => {
    setMobileMenuActive((prevState) => !prevState);
  };

  console.log(mobileMenuActive);

  return (
    <div className={styles.NavMenuMobile}>
      {!mobileMenuActive && <GiHamburgerMenu className={styles.HamburgerMenu} onClick={mobileMenuActivateHandler} />}
      {mobileMenuActive && <GrClose onClick={mobileMenuCloseHandler} />}
      {mobileMenuActive && (
        <div className={styles.mobileMenu}>
          <DropdownMobile className={`${styles.MobileNavMenu}`} />
        </div>
      )}
    </div>
  );
};

export default NavMenuMobile;
