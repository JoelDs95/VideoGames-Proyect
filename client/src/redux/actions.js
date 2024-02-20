import axios from 'axios';

// Action para obtener todos los videojuegos
export const getVideoGames = (currentPage, pageSize, searchTerm = '' ) => async (dispatch) => {
  try {
    const startIndex = (currentPage - 1) * pageSize;
    const url = `/videogames?_start=${startIndex}&_limit=${pageSize}&name_like=${searchTerm}`;
    const response = await axios.get(url);
    dispatch({ type: 'GET_VIDEOGAMES', payload: response.data });
  } catch (error) {
    console.error('Error fetching video games:', error);
  }
};

// Action para obtener un videojuego por su nombre
export const getVideoGameByName = (name) => async (dispatch) => {
  try {
    const response = await axios.get(`/videogames/name?query=${name}`);
    dispatch({ type: 'GET_VIDEOGAME_NAME', payload: response.data });
  } catch (error) {
    console.error('Error fetching video game by name:', error);
  }
};

// Action para obtener los géneros APO
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
      const response = await fetch('/genres');
      const data = await response.json();
      dispatch({ type: 'FETCH_GENRES_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_GENRES_FAILURE', payload: error.message });
    }
  };
};

export const getDetails = (id) => async (dispatch) => {
  try {
    const response = await axios.get(`/videogames/${id}`);
    dispatch({ type: 'GET_DETAILS_SUCCESS', payload: response.data });
  } catch (error) {
    console.error('Error fetching details:', error);
    dispatch({ type: 'GET_DETAILS_FAILURE', payload: error.message });
  }
};
export const createGame = (gameData) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('/videogames', gameData);
      const newGame = response.data.videogame;
      
      return newGame;
    } catch (error) {
      console.error('Error al crear el juego:', error);
      throw error;
    }
  };
};