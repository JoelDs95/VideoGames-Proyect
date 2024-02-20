const { Genre } = require('../models/Genre');

const getAllGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll();
    res.json(genres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error al obtener los géneros.' });
  }
};

module.exports = { getAllGenres };
