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
    let formattedGamesDb;

    const videoGamesDB = await Videogame.findAll({
      include: [{
        model: Genre,
        attributes: ['name'],
        through: { attributes: [] } 
      }]
    });

    formattedGamesDb = videoGamesDB.map(game => {
      const genres = game.genres.map(genre => genre.name);
      return { ...game.toJSON(), genres };
    });

    // Comprobar si hay datos en el caché para combinar con los datos de la Db
    if (videogamesCache && videogamesCache.length > 0) {
      console.log('Obteniendo datos desde el caché...');
      const combinedVideoGames = [...formattedGamesDb, ...videogamesCache];
      return res.json(combinedVideoGames);
    }
    const totalPages = 100;
    const qtySize = 20;
    const allVideoGames = [];

    // Bucle para recorrer en lotes de 20 páginas
    for (let qty = 0; qty < totalPages / qtySize; qty++) {
      const pageStart = qty * qtySize + 1;
      const pageEnd = (qty + 1) * qtySize;
      const requests = [];
      // console.log(pageStart, pageEnd)

      //bucle interno que recorrera el endpoint
      for (let page = pageStart; page <= pageEnd; page++) {
        const url = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&page=${page}`;
        requests.push(axios.get(url));
        // console.log(url)
      }
      const responses = await Promise.all(requests);

      // Manejo de la respuesta y extracion de datos necesarios
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

    const combinedVideoGames = [...formattedGamesDb, ...allVideoGames];
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

    const regexQuery = `^${searchQuery}$`; // Expresión regular para coincidencia

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
    let combinedResults = formattedDbResults;
    
    // Si la db tiene menos de 15 coincidencias continuamos a realizar 
    //la busqueda por la api para completar los 15 resultados
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

      // Combino resultados db y api
      combinedResults = [...formattedDbResults, ...apiGames.slice(0, 15 - formattedDbResults.length)];
    }
    res.json(combinedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/:idVideogame', async (req, res) => {
  try {
    const { idVideogame } = req.params;

    // El videojuego esta en cache?
    if (videogamesCache) {
      const cachedVideogame = videogamesCache.find(vgCache => vgCache.id === +idVideogame);

      if (cachedVideogame) {
        console.log('Obteniendo detalle del videojuego desde el caché...');
        return res.json(cachedVideogame);
      }
    }

    // El videojuego está en Db?
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

    // Si no esta en las consultas anteriores, consultarlo a la Api Ejemplo ID = "945852"
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
    const { name, description, platforms, image, released, rating, genres } = req.body;

    // Validar que se proporcionen al menos un género
    if (!genres || genres.length === 0) {
      return res.status(400).json({ message: 'Debes proporcionar al menos un género' });
    }

    //Creacion y coincidencia de generos... 
    const newVideoGame = await Videogame.create({
      name,
      description,
      platforms,
      image,
      released,
      rating,
    });
    const genreInstances = await Genre.findAll({
      where: { id: genres }
    });
    await newVideoGame.addGenres(genreInstances);
    
    res.status(201).json({ message: 'Videojuego creado exitosamente', videogame: newVideoGame });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;