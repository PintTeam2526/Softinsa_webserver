var express = require('express');
var router = express.Router();
var controllerConquistas = require('../controllers/Conquistas.controller');

// Mostrar todas as conquistas
router.get('/get', controllerConquistas.getAllConquistas);

// Mostrar uma conquista por ID
router.get('/get/:id', controllerConquistas.getConquistaByID);

// Eliminar uma conquista
router.delete('/delete/:id', controllerConquistas.deleteConquistaByID);

module.exports = router;