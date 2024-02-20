const express = require('express');
const axios = require('axios');
const { Videogame, Genre } = require('../db');
const router = express.Router();
const { Op } = require('sequelize');

const RAWG_API_KEY = process.env.API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';


let videogamesCache = null;

router.get('/', async (req, res) => {
  try {
    let formattedVideoGamesDB;

    const videoGamesDB = await Videogame.findAll({
      include: [{
        model: Genre,
        attributes: ['name'],
        through: { attributes: [] }
      }]
    });

    formattedVideoGamesDB = videoGamesDB.map(game => {
      const genres = game.genres.map(genre => genre.name);
      return { ...game.toJSON(), genres };
    });

    // Comprobar si hay datos en el caché
    if (videogamesCache && videogamesCache.length > 0) {
      console.log('Obteniendo datos desde el caché...');
      const combinedVideoGames = [...formattedVideoGamesDB, ...videogamesCache];
      return res.json(combinedVideoGames);
    }

    const totalPages = 50;
    const batchSize = 10;
    const allVideoGames = [];

    // Bucle para recorrer en lotes de 10 páginas
    for (let batch = 0; batch < totalPages / batchSize; batch++) {
      const pageStart = batch * batchSize + 1;
      const pageEnd = (batch + 1) * batchSize;
      const requests = [];

      for (let page = pageStart; page <= pageEnd; page++) {
        const url = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&page=${page}`;
        requests.push(axios.get(url));
      }

      const responses = await Promise.all(requests);

      // Procesar las respuestas y extraer los datos necesarios
      responses.forEach((response) => {
        const videogames = response.data.results.map((result) => {
          return {
            id: result.id,
            name: result.name,
            description: result.description,
            genres: result.genres.map(genre => genre.name),
            platforms: result.platforms.map(platform => platform.platform.name),
            image: result.background_image,
            released: result.released,
            rating: result.rating,
            screenshots: result.short_screenshots.map(screen => screen.image)
          };
        });

        allVideoGames.push(...videogames);
      });
    }

    // Guardar en caché
    videogamesCache = allVideoGames;

    const combinedVideoGames = [...formattedVideoGamesDB, ...allVideoGames];
    res.json(combinedVideoGames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/name', async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = query.toLowerCase();

    const regexQuery = `^${searchQuery}$`; // Expresión regular para coincidencia exacta

    const dbResults = await Videogame.findAll({
      where: {
        name: {
          [Op.regexp]: regexQuery
        }
      },
      include: {
        model: Genre,
        attributes: ['name'],
        through: { attributes: [] } 
      },
      limit: 15
    });
    const formattedDbResults = dbResults.map(game => {
      const genres = game.genres.map(genre => genre.name);
      return { ...game.toJSON(), genres };
    });

    // Paso 2: Consulta a la API externa si no se encuentran suficientes resultados en la base de datos
    let combinedResults = formattedDbResults;

    if (formattedDbResults.length < 15) {
      const apiResults = await axios.get(
        `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${searchQuery}`
      );

      const apiGames = apiResults.data.results.map((result) => {
        return {
          id: result.id,
          name: result.name,
          description: result.description,
          platforms: result.platforms ? result.platforms.map((platform) => platform.platform.name) : [],
          image: result.background_image,
          released: result.released,
          rating: result.rating,
        };
      });

      // Combina los resultados de la base de datos y la API externa
      combinedResults = [...formattedDbResults, ...apiGames.slice(0, 15 - formattedDbResults.length)];
    }

    // Paso 3: Devuelve los resultados combinados al cliente
    res.json(combinedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/:idVideogame', async (req, res) => {
  try {
    const { idVideogame } = req.params;

    // Verificar si el videojuego está en el caché
    if (videogamesCache) {
      const cachedVideogame = videogamesCache.find(vg => vg.id === +idVideogame);

      if (cachedVideogame) {
        console.log('Obteniendo detalle del videojuego desde el caché...');
        return res.json(cachedVideogame);
      }
    }

    // Verificar si el videojuego está en la base de datos
    const dbVideogame = await Videogame.findByPk(idVideogame, {
      include: Genre,
    });

    if (dbVideogame) {
      console.log('Obteniendo detalle del videojuego desde la base de datos...', dbVideogame);
      const genres = dbVideogame.genres.map(genre => genre.name);
      const platforms = Array.isArray(dbVideogame.platforms) ? dbVideogame.platforms : [dbVideogame.platforms];
      const formattedDate = dbVideogame.released.toISOString().substring(0, 10);
      const formattedDbResult = {
        ...dbVideogame.toJSON(),
        genres,
        platforms,
        released: formattedDate,
      };
      return res.json(formattedDbResult);
    }

    // Si no está en la base de datos, consultarlo a la API
    const apiResponse = await axios.get(`${RAWG_BASE_URL}/games/${idVideogame}?key=${RAWG_API_KEY}`);
    const apiVideogame = apiResponse.data;

    console.log('Obteniendo detalle del videojuego desde la API...');

    const mappedVideogame = {
      id: apiVideogame.id,
      name: apiVideogame.name,
      description: apiVideogame.description,
      platforms: apiVideogame.platforms.map(platform => platform.platform.name),
      image: apiVideogame.background_image,
      released: apiVideogame.released,
      rating: apiVideogame.rating,
      genres: apiVideogame.genres.map(genre => genre.name),
    };

    res.json(mappedVideogame);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { name, description, platforms, image, released, rating, genres } = req.body;

    // Validar que se proporcionen al menos un género
    if (!genres || genres.length === 0) {
      return res.status(400).json({ message: 'Debes proporcionar al menos un género' });
    }

    // Crear el videojuego en la base de datos
    const newVideoGame = await Videogame.create({
      name,
      description,
      platforms,
      image,
      released,
      rating,
    });

    const genreInstances = await Genre.findAll({
      where: { id: genres } // Supongo que el nombre del género coincide con el array de géneros que tienes
    });
    
    // Relacionar el videojuego con los géneros proporcionados
    await newVideoGame.addGenres(genreInstances);

    res.status(201).json({ message: 'Videojuego creado exitosamente', videogame: newVideoGame });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;