var express = require('express');
var router = express.Router();
var controllerAreas = require('../controllers/Areas.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Mostrar todas as areas
router.get('/get', controllerAreas.getAllAreas);

// Mostrar uma area com determinado id
router.get('/:id/get', controllerAreas.getAreaByID);   

// Adicionar areas
router.post('/create', authVerification, controllerAreas.createArea);

// Atualizar uma area com determinado id
router.put('/:id/update', authVerification, controllerAreas.updateAreaByID);

// Eliminar uma area com determinado id
router.delete('/:id/delete', authVerification, controllerAreas.deleteAreaByID);


module.exports = router;