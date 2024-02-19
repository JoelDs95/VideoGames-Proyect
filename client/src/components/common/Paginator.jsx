// Paginator.jsx

import React from 'react';
import styles from './Paginator.module.css';

const Paginator = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    if (totalPages <= 7) {
      return pageNumbers.map(number => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={currentPage === number ? styles.active : styles.pageNumber}
        >
          {number}
        </button>
      ));
    } else {
      const firstPage = currentPage > 4 ? currentPage - 2 : 1;
      const lastPage = currentPage < totalPages - 3 ? currentPage + 2 : totalPages;

      return (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={currentPage === 1 ? styles.active : styles.pageNumber}
          >
            1
          </button>
          {currentPage > 4 && <span className={styles.ellipsis}>...</span>}
          {pageNumbers.slice(firstPage, lastPage + 1).map(number => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
              className={currentPage === number ? styles.active : styles.pageNumber}
            >
              {number}
            </button>
          ))}
          {currentPage < totalPages - 3 && <span className={styles.ellipsis}>...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={currentPage === totalPages ? styles.active : styles.pageNumber}
          >
            {totalPages}
          </button>
        </>
      );
    }
  };

  return (
    <div className={styles.paginatorContainer}>
      <div className={styles.paginatorButtonContainer}>
        {renderPageNumbers()}
      </div>
    </div>
  );
};

export default Paginator;
