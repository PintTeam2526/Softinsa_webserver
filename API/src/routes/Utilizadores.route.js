var express = require('express');
var router = express.Router();
var controllerUtilizador = require('../controllers/Utilizadores.controller')
var authVerification = require('../middleware/requireAuth.middleware')

//Mostrar todos os utilizadores
router.get('/get', authVerification,controllerUtilizador.getAllUtilizadores);

//Mostrar um utilizador com um determinado id
router.get('/:id/get', controllerUtilizador.getUtilizadorById);

//Adicionar um utilizador
router.post('/create', authVerification,controllerUtilizador.createUtilizador);

//Atualizar um utilizador com um determinado id
router.put('/:id/update', controllerUtilizador.updateUtilizadorById);

//Mostrar os badges de um utilizador
//router.get('/:id/badges', controllerUtilizador.getAllUsersBadges);
//ENDPOINT NÃO IMPLEMENTADO

//Eliminar um utilizador com um determinado id
router.delete('/:id/delete', controllerUtilizador.deleteUtilizadorById);

//Adicionar um objetivo do consultor
router.post('/:id/objetivo/create', controllerUtilizador.createObjetivo) // -> Consultor

//Apagar um objetivo do consultor
router.delete('/:id/objetivo/delete', controllerUtilizador.deleteObjetivoById); // -> Consultor

// Listar notificações
router.get('/:idUtilizador/notificacoes', authVerification,controllerUtilizador.getAllNotificacoes);

// Enviar uma notificação
router.post('/:idUtilizador/notificacoes/create', authVerification,controllerUtilizador.createNotificacao);




module.exports = router;