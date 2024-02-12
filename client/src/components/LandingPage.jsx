import React from 'react';
import styles from './LandingPage.module.css';

const LandingPage = ({ onClick }) => {
  return (
    <button className={styles.LandingPage} onClick={onClick}>
      Ingresar
    </button>
  );
};

export default LandingPage;