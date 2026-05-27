var express = require('express');
var router = express.Router();
var authVerification = require('../middleware/requireAuth.middleware')
var controllers = require('../controllers/Notificacoes.controller')

router.get("/get", authVerification, controllers.getNotificacoes);
router.post("/post", authVerification, controllers.criarNotificacao);

module.exports = router;