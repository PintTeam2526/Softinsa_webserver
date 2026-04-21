var express = require('express');
var router = express.Router();
var controllerUtilizador = require('../controllers/Utilizadores.controller')
var authVerification = require('../middleware/requireAuth.middleware')

//Mostrar todos os utilizadores
router.get('/get', authVerification,controllerUtilizador.getAllUsers);

//Mostrar um utilizador com um determinado id
router.get('/:id/get', controllerUtilizador.getUserByID);

//Adicionar um utilizador
router.post('/create', authVerification,controllerUtilizador.createUser);

//Atualizar um utilizador com um determinado id
router.put('/:id/update', controllerUtilizador.updateUserByID);

//Mostrar os badges de um utilizador
router.get('/:id/badges', controllerUtilizador.getAllUsersBadges);

//Eliminar um utilizador com um determinado id
router.delete('/:id/delete', controllerUtilizador.getUserByID);

//Adicionar um objetivo do consultor
router.post('/:id/objetivo/create', controllerUtilizador.createObjetivo)

//Apagar um objetivo do consultor
router.delete('/:id/objetivo/delete', controllerUtilizador.deleteObjetivos);

// Listar notificações
router.get('/notificacoes', authVerification,controllerUtilizador.getAllNotificacoes);

// Enviar uma notificação
router.post('/notificacoes/create', authVerification,controllerUtilizador.createNotificacao);


// Mostrar dados da dashboard
router.get('/:id/dashboard', controllerUtilizador.getDashboard );



module.exports = router;