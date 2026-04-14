var express = require('express');
var router = express.Router();
var controllerGestao = require('../controllers/Gestao.controller');

// Buscar todas as SLA
router.get('/get/sla', controllerGestao.getSLA);

// Criar uma SLA
router.post('/create/sla', controllerGestao.createSLA);

// Atualizar uma SLA
router.put('/update/sla/:id', controllerGestao.updateSLA);

// Apagar uma SLA
router.delete('/delete/rgpd/:id', controllerGestao.deleteSLA);

// Buscar todas as RGPD
router.get('/get/rgpd', controllerGestao.getRGPD);

// Criar uma RGPD
router.post('/create/rgpd', controllerGestao.createRGPD);

// Atualizar uma RGPD
router.put('/update/rgpd/:id', controllerGestao.updateRGPD);

// Apagar uma RGPD
router.delete('/delete/rgpd/:id', controllerGestao.deleteRGPD);

module.exports = router;