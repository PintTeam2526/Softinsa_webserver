const express = require('express');

var homepageRouter = require('../controllers/Homepage.controller');
var autenticacaoRouter = require('../controllers/Autenticacao.controller');
var gestaoRouter = require('../controllers/Gestao.controller');
var utilizadoresRouter = require('../controllers/Utilizadores.controller');
var badgesRouter = require('../controllers/Badges.controller');
var areasRouter = require('../controllers/Areas.controller');
var serviceLinesRouter = require('../controllers/ServiceLines.controller');
var learningPathsRouter = require('../controllers/LearningPaths.controller');
var pedidosRouter = require('../controllers/Pedidos.controller');
var conquistasRouter = require('../controllers/Conquistas.controller');
var documentosRouter = require('../controllers/Documentos.controller');
var notificacoesRouter = require('../controllers/Notificacoes.controller');

const router = express.Router();

router.use('/', homepageRouter);
router.use('/autenticacao', autenticacaoRouter);
router.use('/gestao', gestaoRouter);
router.use('/utilizadores', utilizadoresRouter);
router.use('/badges', badgesRouter);
router.use('/areas', areasRouter);
router.use('/serviceLines', serviceLinesRouter);
router.use('/learningPaths', learningPathsRouter);
router.use('/pedidos', pedidosRouter);
router.use('/conquistas', conquistasRouter);
router.use('/documentos', documentosRouter);
router.use('/notificacoes', notificacoesRouter);

module.exports = router;