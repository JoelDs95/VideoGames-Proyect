const initialState = {
  videogames: [],
  allVideogames: [],
  genres: [],
  detail: [],
  loading: true,
  error: null
};

function rootReducer(state = initialState, action) {
  console.log('Estado inicial:', state);
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

    case 'FETCH_GENRES_SUCCESS':
      return {
        ...state,
        genres: action.payload,
      };

    case 'FETCH_GENRES_FAILURE':
      return {
        ...state,
        error: action.payload
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
        error: action.payload
      };

    default:
      return state;
  }
}

export default rootReducer;
