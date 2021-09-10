import React from 'react';
import styles from './Toggle.module.scss';

const Toggle = ({ checked, onChange }) => (
  <>
    <div className={styles['toggle-switch']}>
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className={styles.slider}></span>
      </label>
      {/* <a href="https://dribbble.com/shots/14199649-Dark-Light-Mode-Toggle-Switch-Pattern-A11y">
        Inspired by the design from Tim Silva
      </a> */}
    </div>

    {/* <span className="toggle-control">
      <input className="dmcheck" type="checkbox" checked={checked} onChange={onChange} id="dmcheck" />
      <label htmlFor="dmcheck" />
    </span> */}
  </>
);

export default Toggle;
