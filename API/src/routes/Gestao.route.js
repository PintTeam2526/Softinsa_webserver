var express = require('express');
var router = express.Router();
var controllerGestao = require('../controllers/Gestao.controller');

// Buscar todas as SLA
router.get('/sla/get', controllerGestao.getSLA);

// Criar uma SLA
router.post('/sla/create', controllerGestao.createSLA);

// Atualizar uma SLA
router.put('/sla/:id/update', controllerGestao.updateSLA);

// Apagar uma SLA
router.delete('/rgpd/:id/delete', controllerGestao.deleteSLA);

// Buscar todas as RGPD
router.get('/rgpd/get', controllerGestao.getRGPD);

// Criar uma RGPD
router.post('/rgpd/create', controllerGestao.createRGPD);

// Atualizar uma RGPD
router.put('/rgpd/:id/update', controllerGestao.updateRGPD);

// Apagar uma RGPD
router.delete('/rgpd/:id/delete', controllerGestao.deleteRGPD);

module.exports = router;