import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getVideoGames, getGenres } from "../redux/actions";
import Card from "./common/Card";
import styles from "./Home.module.css";
import NavBar from './NavBar'; 
import Paginator from "./common/Paginator"; // Importa el componente Paginator

const Home = ({ videogames, getVideoGames, getGenres }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [gamesPerPage, setGamesPerPage] = useState(15);

  useEffect(() => {
    console.log("currentPage:", currentPage);
    getGenres(); // Disparar la acción para obtener los géneros cuando el componente se monta
    getVideoGames(currentPage); // Disparar la acción para obtener los videojuegos con los parámetros de paginación
  }, [currentPage]); // Agrega currentPage y pageSize a las dependencias de useEffect

  const getCurrentGames = () => {
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    return videogames.slice(startIndex, endIndex);
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleGamesPerPageChange = (perPage) => {
    setGamesPerPage(perPage);
    setCurrentPage(1); // Resetear a la primera página cuando se cambia el número de juegos por página
  };

  // const handlePageSizeChange = (event) => {
  //   setPageSize(parseInt(event.target.value));
  //   setCurrentPage(1); // Volver a la primera página cuando se cambia el tamaño de la página
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
      <h1>VideoGames</h1>
      <div className={styles.gameList}>
        {currentGames &&
          currentGames.map((game) => (
            <Card
              key={game.id} // Agrega una key para cada Card
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
