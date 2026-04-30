var express = require('express');
var router = express.Router();
var controllerServiceLines = require('../controllers/ServiceLines.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Mostrar todas as service lines
router.get('/get', controllerServiceLines.getAllServiceLines);

// Mostrar uma service line por ID
router.get('/:id/get', controllerServiceLines.getServiceLineById);

// Criar service line
router.post('/create', authVerification,controllerServiceLines.createServiceLine);

// Atualizar service line
router.put('/:id/update', controllerServiceLines.updateServiceLineById);

// Apagar service line
router.delete('/:id/delete', controllerServiceLines.deleteServiceLineById);

module.exports = router;