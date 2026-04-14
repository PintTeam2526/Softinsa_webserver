var express = require('express');
var router = express.Router();
var modeloNotificacoes = require('../controllers/Notificacoes.controller');

// Listar notificações
router.get('/', modeloNotificacoes.getAllNotificacoes);

module.exports = router;