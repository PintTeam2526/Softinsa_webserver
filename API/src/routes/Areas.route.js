var express = require('express');
var router = express.Router();
var controllerAreas = require('../controllers/Areas.controller');

// Mostrar todas as areas
router.get('/get', controllerAreas.getAllAreas);

// Mostrar uma area com determinado id
router.get('/get/:id', controllerAreas.getAreaByID);   

// Adicionar areas
router.post('/create', controllerAreas.createArea);

// Atualizar uma area com determinado id
router.put('/update/:id', controllerAreas.updateAreaByID);

// Apagar uma area com determinado id
router.delete('/delete/:id', controllerAreas.deleteAreaByID);


module.exports = router;