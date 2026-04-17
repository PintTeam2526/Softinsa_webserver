var express = require('express');
var router = express.Router();
var controllerServiceLines = require('../controllers/ServiceLines.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Mostrar todas as service lines
router.get('/get', controllerServiceLines.getAllServiceLines);

// Mostrar uma service line por ID
router.get('/get/:id', controllerServiceLines.getServiceLineByID);

// Criar service line
router.post('/create', authVerification,controllerServiceLines.createServiceLine);

// Atualizar service line
router.put('/update/:id', authVerification,controllerServiceLines.updateServiceLineByID);

// Apagar service line
router.delete('/delete/:id',authVerification, controllerServiceLines.deleteServiceLineByID);

module.exports = router;