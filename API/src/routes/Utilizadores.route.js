var express = require('express');
var router = express.Router();
var controllerUtilizador = require('../controllers/Utilizadores.controller')
var authVerification = require('../middleware/requireAuth.middleware')

//Mostrar todos os utilizadores
router.get('/get', authVerification,controllerUtilizador.getAllUsers);

//Mostrar um utilizador com um determinado id
router.get('/get/:id', authVerification,controllerUtilizador.getUserByID);

//Adicionar um utilizador
router.post('/create', authVerification,controllerUtilizador.createUser);

//Atualizar um utilizador com um determinado id
router.put('/update/:id', authVerification,controllerUtilizador.updateUserByID);

//Eliminar um utilizador com um determinado id
router.delete('/delete/:id',authVerification, controllerUtilizador.getUserByID);

//Adicionar um objetivo do consultor
router.post('/create/objetivo/:id', authVerification,controllerUtilizador.createObjetivo)

//Apagar um objetivo do consultor
router.delete('/delete/objetivo/:id', authVerification,controllerUtilizador.deleteObjetivos);

// Listar notificações
router.get('/notificacoes', authVerification,controllerUtilizador.getAllNotificacoes);

// Enviar uma notificação
router.post('/notificacoes/create', authVerification,controllerUtilizador.createNotificacao);




module.exports = router;