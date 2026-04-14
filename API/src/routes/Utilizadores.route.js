var express = require('express');
var router = express.Router();
var controllerUtilizador = require('../controllers/Utilizadores.controller')

//Mostrar todos os utilizadores
router.get('/get', controllerUtilizador.getAllUsers);

//Mostrar um utilizador com um determinado id
router.get('/get/:id', controllerUtilizador.getUserByID);

//Adicionar um utilizador
router.post('/create', controllerUtilizador.createUser);

//Atualizar um utilizador com um determinado id
router.put('/update/:id', controllerUtilizador.updateUserByID);

//Eliminar um utilizador com um determinado id
router.delete('/delete/:id', controllerUtilizador.getUserByID);

//Adicionar um objetivo do consultor
router.post('/create/objetivo/:id', controllerUtilizador.createObjetivo)

//Apagar um objetivo do consultor
router.delete('/delete/objetivo/:id', controllerUtilizador.deleteObjetivos);

// Listar notificações
router.get('/notificacoes', controllerUtilizador.getAllNotificacoes);

// Enviar uma notificação
router.post('/notificacoes/create', controllerUtilizador.createNotificacao);



module.exports = router;