import axios from 'axios';

//obtener los videojuegos
export const getVideoGames = () => async (dispatch) => {
  try {
    const url = `/videogames`;
    const response = await axios.get(url);
    dispatch({ type: 'GET_VIDEOGAMES', payload: response.data });
  } catch (error) {
    console.error('Error fetching video games:', error);
  }
};
//obtener nombre
export const getVideoGameByName = (name) => async (dispatch) => {
  try {
    const url = `/videogames/name?query=${name}`;
    const response = await axios.get(url);
    dispatch({ type: 'GET_VIDEOGAME_NAME', payload: response.data });
  } catch (error) {
    console.error('Error fetching video game by name:', error);
  }
};

//géneros APO
export const getGenres = () => async (dispatch) => {
  try {
    const response = await axios.get('/genres');
    dispatch({ type: 'GET_GENRES', payload: response.data });
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
};
// Action para obtener los géneros DB
export const fetchGenres = () => {
  return async (dispatch) => {
    try {
      const response = await fetch('/genresDb');
      const data = await response.json();
      dispatch({ type: "GET_GENRES", payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_GENRES_FAILURE', payload: error.message });
    }
  };
};

export const getDetails = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`/videogames/${id}`);
    dispatch({ type: 'GET_DETAILS', payload: response.data });
  } catch (error) {
    console.error('Error fetching details:', error);
    dispatch({ type: 'GET_DETAILS_FAILURE', payload: error.message });
  }
};
export const createGame = (gameData) => {
  return async () => {
    try {
      const response = await axios.post('/videogames', gameData);
      const newVideoGame = response.data.videogame;
      
      return newVideoGame;
    } catch (error) {
      console.error('Error al crear el juego:', error);
      throw error;
    }
  };
};