var express = require('express');
var router = express.Router();
var controllerNotificacoes = require('../controllers/Notificacoes.controller');

// Listar notificações
router.get('/', controllerNotificacoes.getAllNotificacoes);

// Enviar uma notificação
router.post('/create', controllerNotificacoes.createNotificacao);

module.exports = router;