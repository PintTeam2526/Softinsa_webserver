var express = require('express');
var router = express.Router();
var controllerGestao = require('../controllers/Gestao.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Buscar todas as RGPD
//router.get('/rgpd/get', controllerGestao.getRGPD);

// Atualizar uma RGPD
//router.put('/rgpd/update', authVerification, controllerGestao.updateRGPD);

// Buscar consultores e badges obtidos para certificado
router.get('/certificado', authVerification, controllerGestao.badgesConsultores)

// Rank de consultores por progresso
router.get('/rank', authVerification, controllerGestao.rankConsultores)

// Rota para dados de relatorio
router.post("/relatorio", authVerification, controllerGestao.relatorio);



module.exports = router;