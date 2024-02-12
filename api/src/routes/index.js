const { Router } = require('express');
const videoGameRoute = require('./videoGame');
const genreRoute = require('./genre');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
router.use('/videogames', videoGameRoute);
router.use('/genres', genreRoute);
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
