//VER SE FAZ SENTIDO TER)

var express = require('express');
var router = express.Router();
var controllerGestao = require('../controllers/Gestao.controller');

// Exemplo: obter dados de gestão
router.get('/', controllerGestao.getDados);

module.exports = router;