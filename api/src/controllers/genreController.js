const { Genre } = require('../models'); // Ajusta la ruta correcta a tu modelo

const genreController = {
  getAllGenres: async (req, res) => {
    try {
      const genres = await Genre.findAll();
      res.status(200).json(genres);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los géneros' });
    }
  },
};

module.exports = genreController;