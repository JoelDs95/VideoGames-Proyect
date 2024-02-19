import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './LandingPage.module.css';

//Landing Page, pagina de entrada para redirecionar al /Home
const LandingPage = () => {
  const history = useHistory();
  const handleButtonClick = () => {history.push('/home')};

  return (
    <div className={styles.LandingPage} >
      <button className={styles.LandingPageButton} onClick={handleButtonClick}>
        Ingresar
      </button>
    </div>
  );
};

export default LandingPage;