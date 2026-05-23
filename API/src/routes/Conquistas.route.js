var express = require('express');
var router = express.Router();
var controllerConquistas = require('../controllers/Conquistas.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Mostrar todas as conquistas de um consultor
router.get('/get/consultor', controllerConquistas.getConquistaByIdConsultor);


module.exports = router;