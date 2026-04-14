var express = require('express');
var router = express.Router();
var controllerServiceLines = require('../controllers/ServiceLines.controller');

// Mostrar todas as service lines
router.get('/get', controllerServiceLines.getAllServiceLines);

// Mostrar uma service line por ID
router.get('/get/:id', controllerServiceLines.getServiceLineByID);

// Criar service line
router.post('/create', controllerServiceLines.createServiceLine);

// Atualizar service line
router.put('/update/:id', controllerServiceLines.updateServiceLine);

// Apagar service line
router.delete('/delete/:id', controllerServiceLines.deleteServiceLineByID);

module.exports = router;