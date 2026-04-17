var express = require('express');
var router = express.Router();
var controllerGestao = require('../controllers/Gestao.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Buscar todas as SLA
router.get('/get/sla',authVerification, controllerGestao.getSLA);

// Criar uma SLA
router.post('/create/sla',authVerification, controllerGestao.createSLA);

// Atualizar uma SLA
router.put('/update/sla/:id',authVerification, controllerGestao.updateSLA);

// Apagar uma SLA
router.delete('/delete/rgpd/:id',authVerification, controllerGestao.deleteSLA);

// Buscar todas as RGPD
router.get('/get/rgpd',authVerification, controllerGestao.getRGPD);

// Criar uma RGPD
router.post('/create/rgpd',authVerification, controllerGestao.createRGPD);

// Atualizar uma RGPD
router.put('/update/rgpd/:id',authVerification, controllerGestao.updateRGPD);

// Apagar uma RGPD
router.delete('/delete/rgpd/:id',authVerification, controllerGestao.deleteRGPD);

module.exports = router;