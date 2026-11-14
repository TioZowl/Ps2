const express = require('express');

const router = express.Router();

const categoriasController =
require('../controllers/categoriasController');

const verificarToken =
require('../middlewares/authMiddleware');

const verificarAdmin =
require('../middlewares/roleMiddleware');


// Públicas
router.get('/',
    categoriasController.getAll
);

router.get('/:id',
    categoriasController.getById
);


// Solo admin
router.post('/',
    verificarToken,
    verificarAdmin,
    categoriasController.create
);

router.put('/:id',
    verificarToken,
    verificarAdmin,
    categoriasController.update
);

router.delete('/:id',
    verificarToken,
    verificarAdmin,
    categoriasController.delete
);

module.exports = router;