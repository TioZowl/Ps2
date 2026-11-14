const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const verificarToken = require('../middlewares/authMiddleware');
const verificarAdmin = require('../middlewares/roleMiddleware');

router.post('/registro', usuariosController.registro);
router.post('/login', usuariosController.login);

// Cada usuario consulta su propio perfil; el listado sigue siendo solo para admins.
router.get('/me', verificarToken, usuariosController.getMe);
router.get('/', verificarToken, verificarAdmin, usuariosController.getAll);
router.get('/:id', verificarToken, verificarAdmin, usuariosController.getById);
// El controlador limita el cambio al propio perfil o a un administrador.
router.put('/:id', verificarToken, usuariosController.update);
router.delete('/:id', verificarToken, verificarAdmin, usuariosController.delete);

module.exports = router;
