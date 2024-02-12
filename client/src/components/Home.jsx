// Home.jsx
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getVideoGames, getGenres } from '../redux/actions';
import Card from './Card';
import styles from './Home.module.css';

const Home = ({ videogames, getVideoGames, getGenres }) => {
  useEffect(() => {
    getGenres(); // Disparar la acción para obtener los géneros cuando el componente se monta
    getVideoGames(); // Disparar la acción para obtener los videojuegos cuando el componente se monta
  }, [getVideoGames, getGenres]); // Agrega getGenres a las dependencias de useEffect
  
  return (
    <div className={styles.home}>
      <h1>Home Page</h1>
      <div className={styles.gameList}>
        {videogames.map((game) => (
          <Card
            id={game.id} // Agrega una key para cada Card
            name={game.name}
            image={game.image}
            genres={game.genres}
          />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  videogames: state.videogames
});

const mapDispatchToProps = {
  getVideoGames,
  getGenres // Agrega getGenres a mapDispatchToProps
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
