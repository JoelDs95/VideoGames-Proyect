import React, { useState } from 'react';
import { Link } from "react-router-dom";
import SearchBar from "./common/SearchBar";
import styles from "./NavBar.module.css";
import Modal from './ModalCreate';

const NavBar = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    };
  return (
    <div className={styles.navbar}>
      <SearchBar />
      {/* <Link to={"/create"}> */}
        <button  onClick={openModal} className={styles.homeButton}>
          New Game
        </button>
        <Modal isOpen={modalOpen} closeModal={closeModal} />
      {/* </Link> */}
    </div>
  );
};

export default NavBar;
