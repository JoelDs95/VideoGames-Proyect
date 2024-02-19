import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getVideoGameByName } from '../../redux/actions'; // Importa la acción

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(getVideoGameByName(searchQuery)); // Llama a la acción para buscar juegos por nombre
  };

  const handleChange = (e) => {
    setSearchQuery(e.target.value); // Actualiza el estado con el valor del input
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(); // Llama a la función de búsqueda si se presiona Enter
    }
  };

  return (
    <div style={{ width: '35%', margin: '0 auto', marginTop: '20px', position: 'relative' }}>
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="Buscar juegos por nombre..."
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      <br />
    </div>
  );
};

export default SearchBar;