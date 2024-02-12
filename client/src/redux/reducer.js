const initialState = {
  videogames: [],
  allVideogames: [],
  genres: [],
  detail: {},
  loading: true,
  platforms: [],
  error: null
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_VIDEOGAMES':
      return {
        ...state,
        videogames: action.payload,
        allVideogames: action.payload
      };

    case 'GET_VIDEOGAME_NAME':
      return {
        ...state,
        videogames: action.payload
      };

    case 'GET_GENRES':
      return {
        ...state,
        genres: action.payload
      };

    case 'POST_VIDEOGAME':
      return {
        ...state,
      };

    case 'FILTER_BY_GENRE':
      const allGames = state.videogames;
      const genresFiltered = action.payload === 'All' ?
        state.allVideogames
        : allGames.filter(el => el.genres.find(el => el.name === action.payload));
      return {
        ...state,
        videogames: genresFiltered
      };

    case 'FILTER_CREATED':
      const filterCreated = action.payload === 'Created' ?
        state.allVideogames.filter(el => el.createdInDb)
        : state.allVideogames.filter(el => !el.createdInDb)
      return {
        ...state,
        videogames: action.payload === 'All' ? state.allVideogames : filterCreated
      };

    case 'ORDER_BY_NAME':
      let sortName = action.payload === 'Asc' ?
        state.videogames.sort((a, b) => a.name.localeCompare(b.name))
        : state.videogames.sort((a, b) => b.name.localeCompare(a.name));
      return {
        ...state,
        videogames: sortName,
      };

    case 'ORDER_BY_RATING':
      let sortRating = action.payload === 'Low' ?
        state.videogames.sort((a, b) => a.rating - b.rating)
        : state.videogames.sort((a, b) => b.rating - a.rating);
      return {
        ...state,
        videogames: sortRating,
      };

    case 'GET_DETAILS':
      return {
        ...state,
        detail: action.payload
      };

    case 'GET_DETAILS_SUCCESS':
      return {
        ...state,
        detail: action.payload
      };

    case 'GET_DETAILS_FAILURE':
      return {
        ...state,
        detail: {} // O alguna otra lógica de manejo de errores
      };

    case 'GET_PLATFORMS':
      return {
        ...state,
        platforms: action.payload
      };

    // Agrega casos para otras acciones según sea necesario

    default:
      return state;
  }
}

export default rootReducer;
