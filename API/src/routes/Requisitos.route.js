var express = require('express');
var router = express.Router();
var controllerRequisitos = require('../controllers/Requisitos.controller');
var authVerification = require('../middleware/requireAuth.middleware');

router.get('/get/badge/:id', controllerRequisitos.getRequisitosBadgeMobile);

module.exports = router;