var express = require('express');
var router = express.Router();
var modeloServiceLines = require('../controllers/ServiceLines.controller');

// Mostrar todas as service lines
router.get('/show', modeloServiceLines.getAllServiceLines);

// Mostrar uma service line por ID
router.get('/show/:id', modeloServiceLines.getServiceLineByID);

// Criar service line
router.post('/create', modeloServiceLines.createServiceLine);

// Atualizar service line
router.put('/update/:id', modeloServiceLines.updateServiceLine);

// Apagar service line
router.delete('/delete/:id', modeloServiceLines.deleteServiceLineByID);

module.exports = router;