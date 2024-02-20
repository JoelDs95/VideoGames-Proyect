const express = require('express');
const axios = require('axios');
const { Genre } = require('../db');
const RAWG_API_KEY = process.env.API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';
 
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const apiResponse = await axios.get(`${RAWG_BASE_URL}/genres?key=${RAWG_API_KEY}`);

    const genres = apiResponse.data.results.map(async (result) => {
      const genre = {
        id: result.id,
        name: result.name,
      };

      // Consultar si el género ya existe en la base de datos
      const existingGenre = await Genre.findOne({ where: { id: genre.id } });

      // Si el género no existe, guardarlo en la base de datos
      if (!existingGenre) {
        await Genre.create(genre);
      }

      return genre;
    });

    const savedGenres = await Promise.all(genres);

    res.json(savedGenres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
router.get('/genres', async (req, res) => {
  try {
    const genres = await Genre.findAll({ attributes: ['id', 'name'] });
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al obtener los géneros.' });
  }
});



module.exports = router;
