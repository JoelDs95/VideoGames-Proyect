const express = require('express');
const axios = require('axios');
const { Genre } = require('../db');
const RAWG_API_KEY = process.env.API_KEY;
const RAWG_BASE_URL = 'https://api.rawg.io/api';
 
const router = express.Router();

//obtener los generos de Api y guardarlos en Db
router.get('/', async (req, res) => {
  try {
    const apiResponse = await axios.get(`${RAWG_BASE_URL}/genres?key=${RAWG_API_KEY}`);
    const genres = apiResponse.data.results.map(async (result) => {
      const genre = {
        id: result.id,
        name: result.name,
      };

      // los generos ya existen en db ?
      const existingGenre = await Genre.findOne({ where: { id: genre.id } });
      // Si el genero no existe, guardarlo en la db
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

//traer mis genreos de la db y aplicar a filtro y multiSelect
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
