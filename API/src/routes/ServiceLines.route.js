var express = require('express');
var router = express.Router();
var controllerServiceLines = require('../controllers/ServiceLines.controller');

// Mostrar todas as service lines
router.get('/get', controllerServiceLines.getAllServiceLines);

// Mostrar uma service line por ID
router.get('/:id/get', controllerServiceLines.getServiceLineByID);

// Criar service line
router.post('/create', controllerServiceLines.createServiceLine);

// Atualizar service line
router.put('/:id/update', controllerServiceLines.updateServiceLineByID);

// Apagar service line
router.delete('/:id/delete', controllerServiceLines.deleteServiceLineByID);

module.exports = router;