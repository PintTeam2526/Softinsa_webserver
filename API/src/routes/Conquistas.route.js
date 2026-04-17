var express = require('express');
var router = express.Router();
var controllerConquistas = require('../controllers/Conquistas.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Mostrar todas as conquistas
router.get('/get', controllerConquistas.getAllConquistas);

// Mostrar uma conquista por ID
router.get('/get/:id', controllerConquistas.getConquistaByID);

// Adicionar conquistas
router.post('/create', authVerification,controllerConquistas.createConquista);

// Atualizar uma conquista com determinado id
router.put('/update/:id', authVerification,controllerConquistas.updateConquistaByID);

// Eliminar uma conquista por ID
router.delete('/delete/:id', authVerification,controllerConquistas.deleteConquistaByID);


module.exports = router;