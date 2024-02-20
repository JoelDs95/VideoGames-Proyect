import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useSelector } from "react-redux";
import { getVideoGames, getGenres, fetchGenres } from "../redux/actions";
import Card from "./common/Card";
import styles from "./Home.module.css";
import NavBar from './NavBar'; 
import Paginator from "./common/Paginator";

const Home = ({ videogames, getVideoGames, getGenres, fetchGenres }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage, setGamesPerPage] = useState(15);
  const [sortBy, setSortBy] = useState("");
  const [genreFilter, setGenreFilter] = useState(""); // Estado para el filtro de género
  const genres = useSelector(state => state.genres);
  // const [platformFilter, setPlatformFilter] = useState(null);

  useEffect(() => {
    // console.log("currentPage:", currentPage);
    getGenres(); 
    fetchGenres();
    getVideoGames(currentPage); // Disparar la acción para obtener los videojuegos con los parámetros de paginación
  }, [currentPage, fetchGenres, getVideoGames]); 

  const getCurrentGames = () => {
    let filteredGames = [...videogames]; 
    if (genreFilter) {
      filteredGames = filteredGames.filter(game => game.genres.includes(genreFilter));
    }
    // if (platformFilter) {
    //   filteredGames = filteredGames.filter(game => game.platforms.includes(platformFilter));
    // }
    
    if (sortBy) { 
      // Aplicar ordenamiento si se ha seleccionado una opción
      if (sortBy === 'name') {
        filteredGames.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === 'releaseDate') {
        filteredGames.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
      } else if (sortBy === 'rating') {
        filteredGames.sort((a, b) => b.rating - a.rating);
      }
    }
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    return filteredGames.slice(startIndex, endIndex);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleGamesPerPageChange = (perPage) => {
    setGamesPerPage(perPage);
    setCurrentPage(1); // Resetear a la primera página cuando se cambia el número de juegos por página
  };
  const handleSortChange = (event) => {
    const newSortBy = event.target.value;
    setSortBy(newSortBy);
  };

  const handleGenreChange = (event) => {
    const newGenreFilter = event.target.value;
    setGenreFilter(newGenreFilter);
  };
  // const handlePlatformChange = (event) => {
  //   const newPlatformFilter = event.target.value;
  //   setPlatformFilter(newPlatformFilter);
  // };


  const currentGames = getCurrentGames();

  return (
    <div className={styles.home}>
      <NavBar />
      <select
        value={gamesPerPage}
        onChange={(e) => handleGamesPerPageChange(parseInt(e.target.value))}
      >
        <option value={15}>15</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <select value={sortBy} onChange={handleSortChange}> {/* Select para elegir el tipo de ordenamiento */}
        <option value="">Ordenar por...</option>
        <option value="name">Nombre</option>
        <option value="releaseDate">Fecha de Lanzamiento</option>
        <option value="rating">Rating</option>
      </select>
      <select value={genreFilter} onChange={handleGenreChange}>
        <option value="">Género...</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.name}>{genre.name}</option>
        ))}        
      </select>
      {/* <select value={platformFilter} onChange={handlePlatformChange}>
        <option value="">Plataformas...</option>
      </select> */}
      <h1>VideoGames</h1>
      <div className={styles.gameList}>
        {currentGames &&
          currentGames.map((game) => (
            <Card
              key={game.id}
              id={game.id}
              name={game.name}
              image={game.image}
              genres={game.genres}
            />
          ))}
      </div>
      <Paginator
        currentPage={currentPage}
        totalPages={Math.ceil(videogames.length / gamesPerPage)}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  videogames: state.videogames,
});

const mapDispatchToProps = {
  getVideoGames,
  getGenres,
  fetchGenres,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
