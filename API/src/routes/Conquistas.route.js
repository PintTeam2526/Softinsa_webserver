var express = require('express');
var router = express.Router();
var controllerConquistas = require('../controllers/Conquistas.controller');

// Mostrar todas as conquistas
router.get('/get', controllerConquistas.getAllConquistas);

// Mostrar uma conquista por ID
router.get('/:id/get', controllerConquistas.getConquistaByID);

// Adicionar conquistas
router.post('/create', controllerConquistas.createConquista);

// Atualizar uma conquista com determinado id
router.put('/:id/update', controllerConquistas.updateConquistaByID);

// Eliminar uma conquista por ID
router.delete('/:id/delete', controllerConquistas.deleteConquistaByID);


module.exports = router;