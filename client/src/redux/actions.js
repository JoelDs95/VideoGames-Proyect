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

// Action para obtener los géneros
export const getGenres = () => async (dispatch) => {
  try {
    const response = await axios.get('/genres');
    dispatch({ type: 'GET_GENRES', payload: response.data });
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
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
      // Aquí podrías despachar otra acción si lo necesitas, por ejemplo para actualizar el estado de tu aplicación
      // dispatch(gameCreated(newGame));
      return newGame; // Puedes devolver el nuevo juego creado si lo necesitas en el componente
    } catch (error) {
      console.error('Error al crear el juego:', error);
      throw error; // Puedes manejar el error en el componente que llama a esta acción
    }
  };
};