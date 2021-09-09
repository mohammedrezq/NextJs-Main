import { useState, useEffect, useRef, forwardRef } from 'react';
import Link from 'next/link';
import { FaSearch, FaChevronDown } from 'react-icons/fa';


import useSite from 'hooks/use-site';
import styles from './DropdownMobile.module.scss';
import { findMenuByLocation, MENU_LOCATION_NAVIGATION_DEFAULT } from 'lib/menus';

const DropdownMobile = () => {
  const [subMenu, setSubMenu] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const subMenuRef = useRef(null);

  const openSubMenuHandler = (index) => {
      setActiveIndex(index)
    setSubMenu((prevState) => !prevState);
  };


  useEffect(() => {
    const pageClickEvent = (e) => {
      if (subMenuRef.current !== null && !subMenuRef.current.contains(e.target)) {
        setSubMenu(!subMenu);
      }
    };

    // If the item is active (ie open) then listen for clicks
    if (subMenu) {
      window.addEventListener('click', pageClickEvent);
    }

    return () => {
      window.removeEventListener('click', pageClickEvent);
    };
  }, [subMenu]);

  const { menus } = useSite();
  const navigation = findMenuByLocation(menus, [
    process.env.WORDPRESS_MENU_LOCATION_NAVIGATION,
    MENU_LOCATION_NAVIGATION_DEFAULT,
  ]);


  return (
    <>
      <ul className={styles.navMenu}>
        {navigation?.map(({ id, path, label, title, target, children }, index) => {
          const newPath = path.split('/');
          const articleType = newPath.includes('articles');
          const thePath = articleType ? `/${newPath[2]}/${newPath[3]}` : `/${newPath[2]}`;
          return (
            <li key={index}>
              {!thePath.includes('http') && !target && (
                <div className={styles.menuItemHasChildren}>
                  {children?.length > 0 && (
                    <>
                      <button key={index} onClick={() =>openSubMenuHandler(index)} key={index} className={styles.menuItemHasChildrenClosed}>
                        <FaChevronDown />
                      </button>
                    </>
                  )}
                  <Link href={thePath}>
                    <a title={title}>{label}</a>
                  </Link>
                </div>
              )}
              {thePath.includes('http') && (
                <a href={thePath} title={title} target={target}>
                  {label}
                </a>
              )}

              {children?.length > 0 && (
                <ul ref={subMenuRef} key={index} className={(subMenu && activeIndex === index) ? styles.navSubMenu : styles.navSubMenuClosed}>
                  {children.map(({ id, path, label, title, target }) => {
                    const newPath = path.split('/');
                    const articleType = newPath.includes('articles');
                    const thePath = articleType ? `/${newPath[2]}/${newPath[3]}` : `/${newPath[2]}`;
                    return (
                      <li key={id}>
                        {!thePath.includes('http') && !target && (
                          <Link href={thePath}>
                            <a title={title}>{label}</a>
                          </Link>
                        )}
                        {thePath.includes('http') && (
                          <a href={thePath} title={title} target={target}>
                            {label}
                          </a>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default DropdownMobile;
