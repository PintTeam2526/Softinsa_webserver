var express = require('express');
var router = express.Router();
var controllerGestao = require('../controllers/Gestao.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Buscar o RGPD
router.get('/rgpd/get', controllerGestao.getRGPD);

// Atualizar o RGPD
router.put('/rgpd/update', authVerification, controllerGestao.updateRGPD);

// Buscar consultores e badges obtidos para certificado
router.get('/certificado', authVerification, controllerGestao.badgesConsultores)

// Rank de consultores por progresso
router.get('/rank', authVerification, controllerGestao.rankConsultores)

// Rota para dados de relatorio
router.post("/relatorio", authVerification, controllerGestao.relatorio);

//Rota de desenvolvimento para apagar os dados da base de dados
router.post("/BDWipe",authVerification,controllerGestao.BDWipe);

//Rota para verificar o ram que esta a ser utilizado
router.get("/ram", controllers.getRAMUsage);

module.exports = router;