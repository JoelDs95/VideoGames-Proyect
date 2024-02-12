const { Videogame } = require('../models'); // Ajusta la ruta correcta a tus modelos
const { Op } = require('sequelize');

const videoGameController = {
  getAllVideogames: async (req, res) => {
    try {
      const videogames = await Videogame.findAll();
      res.status(200).json(videogames);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los videojuegos' });
    }
  },

  getVideogameById: async (req, res) => {
    try {
      const { idVideogame } = req.params;
      const videogame = await Videogame.findByPk(idVideogame);
      if (!videogame) {
        return res.status(404).json({ error: 'Videojuego no encontrado' });
      }
      res.status(200).json(videogame);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el videojuego por ID' });
    }
  },

  getVideogameByName: async (req, res) => {
    try {
      const { name } = req.query;
      const videogames = await Videogame.findAll({
        where: {
          name: {
            [Op.iLike]: `%${name}%`, // Case-insensitive search
          },
        },
      });
      if (videogames.length === 0) {
        return res.status(404).json({ error: 'No se encontraron videojuegos' });
      }
      res.status(200).json(videogames);
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar videojuegos por nombre' });
    }
  },

  createVideogame: async (req, res) => {
    try {
      const { name, description, released, rating, genres } = req.body;
      const newVideogame = await Videogame.create({
        name,
        description,
        released,
        rating,
      });
      // Aquí puedes añadir la lógica para relacionar el videojuego con los géneros
      res.status(201).json(newVideogame);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el nuevo videojuego' });
    }
  },
};

module.exports = videoGameController;