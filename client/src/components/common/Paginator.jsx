import React from 'react';

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
          className={currentPage === number}
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
          >
            1
          </button>
          {currentPage > 4 && <span>...</span>}
          {pageNumbers.slice(firstPage, lastPage + 1).map(number => (
            <button
              key={number}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          ))}
          {currentPage < totalPages - 3 && <span >...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      );
    }
  };

  return (
    <div >
      
        {renderPageNumbers()}
      
    </div>
  );
};

export default Paginator;
