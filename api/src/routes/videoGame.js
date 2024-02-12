const express = require('express');
const axios = require('axios');
const { Videogame, Genre } = require('../db');
const router = express.Router();

const RAWG_API_KEY = process.env.API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';


let videogamesCache = null;

router.get('/', async (req, res) => {
  try {
    // Verificar si la información está en el caché
    if (videogamesCache) {
      console.log('Obteniendo datos desde el caché...');
      return res.json(videogamesCache);
    }

    const totalPages = 50;
    const batchSize = 10;
    const allVideogames = [];

    // Bucle para recorrer en lotes de 10 páginas
    for (let batch = 0; batch < totalPages / batchSize; batch++) {
      const pageStart = batch * batchSize + 1;
      const pageEnd = (batch + 1) * batchSize;

      // Hacer peticiones a la API para cada página del lote
      const requests = [];

      for (let page = pageStart; page <= pageEnd; page++) {
        const url = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&page=${page}`;
        requests.push(axios.get(url));
      }

      // Esperar a que todas las peticiones se completen
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

        allVideogames.push(...videogames);
      });
    }

    // Guardar en el caché para futuras consultas
    videogamesCache = allVideogames;

    res.json(allVideogames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.get('/name', async (req, res) => {
  try {
    const { query } = req.query;
    const searchQuery = query.toLowerCase();

    // Comentar o eliminar la siguiente sección que consulta en la base de datos
    /*
    const dbGame = await VideoGame.findOne({
      where: { name: searchQuery },
    });

    if (dbGame) {
      // Si se encuentra en la base de datos, agregarlo a los resultados
      apiGames.unshift({
        id: dbGame.id,
        name: dbGame.name,
        description: dbGame.description,
        platforms: dbGame.platforms,
        image: dbGame.image,
        released: dbGame.release,
        rating: dbGame.rating,
      });
    }
    */

    // Consultar directamente a la API
    const apiResults = await axios.get(
      `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${searchQuery}`
    );

    const apiGames = apiResults.data.results.map((result) => {
      return {
        id: result.id,
        name: result.name,
        description: result.description,
        platforms: result.platforms.map((platform) => platform.platform.name),
        image: result.background_image,
        released: result.released,
        rating: result.rating,
      };
    });

    // Devolver los primeros 15 resultados
    res.json(apiGames.slice(0, 15));
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
      console.log('Obteniendo detalle del videojuego desde la base de datos...');
      return res.json({
        id: dbVideogame.id,
        name: dbVideogame.name,
        description: dbVideogame.description,
        platforms: dbVideogame.platforms,
        image: dbVideogame.image,
        released: dbVideogame.released,
        rating: dbVideogame.rating,
        genres: dbVideogame.Genres,
        
      });
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
    const { name, description, platforms, image, release, rating, genres } = req.body;

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
      release,
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
// ... Otras rutas

module.exports = router;