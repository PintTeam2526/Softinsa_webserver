const express = require('express');

var autenticacaoRouter = require('../routes/Autenticacao.route');
var areasRouter = require('../routes/Areas.route');
//var gestaoRouter = require('../routes/Gestao.route');
var utilizadoresRouter = require('../routes/Utilizadores.route');
var badgesRouter = require('../routes/Badges.route');

var serviceLinesRouter = require('../routes/ServiceLines.route');
var learningPathsRouter = require('../routes/LearningPaths.route');
var pedidosBadgesRouter = require('../routes/PedidosBadges.route');
//var conquistasRouter = require('../routes/Conquistas.route');
//var documentosRouter = require('../routes/Documentos.route');
//var notificacoesRouter = require('../routes/Notificacoes.route');

const router = express.Router();

router.use('/autenticacao', autenticacaoRouter);
router.use('/areas', areasRouter);
//router.use('/gestao', gestaoRouter);
router.use('/utilizadores', utilizadoresRouter);
router.use('/badges', badgesRouter);

router.use('/serviceLines', serviceLinesRouter);
router.use('/learningPaths', learningPathsRouter);
router.use('/pedidos', pedidosBadgesRouter);
//router.use('/conquistas', conquistasRouter);
//router.use('/documentos', documentosRouter);
//router.use('/notificacoes', notificacoesRouter);

module.exports = router;