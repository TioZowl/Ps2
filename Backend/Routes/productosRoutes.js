const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/roleMiddleware');

// Rutas públicas
router.get('/', productosController.getAll);
router.get('/:id', productosController.getById);

// Rutas protegidas (solo admin)
router.post('/', verificarToken, verificarAdmin, productosController.create);
router.put('/:id', verificarToken, verificarAdmin, productosController.update);
router.delete('/:id', verificarToken, verificarAdmin, productosController.delete);

module.exports = router;