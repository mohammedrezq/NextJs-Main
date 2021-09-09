import { useState, useEffect, useRef, forwardRef } from 'react';
import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import useSite from 'hooks/use-site';
import styles from './DropdownMobile.module.scss';
import { findMenuByLocation, MENU_LOCATION_NAVIGATION_DEFAULT } from 'lib/menus';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  expanded: {
    "&$expanded": {
      margin: 0,
      borderRadius: 0,
    }
  },
  backgroundColorAccordion: {
    backgroundColor: '#00627b',
  },
  backgroundColorAccordionDetails: {
    backgroundColor: '#f8f8f8',
  },
  hrefColor: {
    color: "#fff"
  },
  childHrefColor: {
    color: "#000"
  },
}));

const DropdownMobile = () => {
  const classes = useStyles();

  const [subMenu, setSubMenu] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const subMenuRef = useRef(null);

  const openSubMenuHandler = (index) => {
    setActiveIndex(index);
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
      <div className={`${classes.root}`}>
        {navigation?.map(({ id, path, label, title, target, children }, index) => {
          const newPath = path.split('/');
          const articleType = newPath.includes('articles');
          const thePath = articleType ? `/${newPath[2]}/${newPath[3]}` : `/${newPath[2]}`;
          return (
            <Accordion key={index} className={`${classes.expanded} ${classes.backgroundColorAccordion}  ${classes.accordionBorderRadius}`}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                {!thePath.includes('http') && !target && (
                  <Typography className={classes.heading}>
                    <Link href={thePath}>
                      <a className={classes.hrefColor} title={title}>{label}</a>
                    </Link>
                    {thePath.includes('http') && (
                      <a className={classes.hrefColor} href={thePath} title={title} target={target}>
                        {label}
                      </a>
                    )}
                  </Typography>
                )}
              </AccordionSummary>
              <AccordionDetails className={`${classes.backgroundColorAccordionDetails}`}>
                <Typography>
                  {children?.length > 0 &&
                    children.map(({ id, path, label, title, target }) => {
                      const newPath = path.split('/');
                      const articleType = newPath.includes('articles');
                      const thePath = articleType ? `/${newPath[2]}/${newPath[3]}` : `/${newPath[2]}`;
                      return (
                        <div key={id}>
                          {!thePath.includes('http') && !target && (
                            <Link href={thePath}>
                              <a className={classes.childHrefColor} title={title}>{label}</a>
                            </Link>
                          )}
                          {thePath.includes('http') && (
                            <a className={classes.childHrefColor} href={thePath} title={title} target={target}>
                              {label}
                            </a>
                          )}
                        </div>
                      );
                    })}
                </Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </div>
      {/* <ul className={styles.navMenu}>
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
                      <button
                        key={index}
                        onClick={() => openSubMenuHandler(index)}
                        key={index}
                        className={styles.menuItemHasChildrenClosed}
                      >
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
                <ul
                  ref={subMenuRef}
                  key={index}
                  className={subMenu && activeIndex === index ? styles.navSubMenu : styles.navSubMenuClosed}
                >
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
      </ul> */}
    </>
  );
};

export default DropdownMobile;
