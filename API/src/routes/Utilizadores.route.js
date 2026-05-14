var express = require('express');
var router = express.Router();
var controllerUtilizador = require('../controllers/Utilizadores.controller')
var authVerification = require('../middleware/requireAuth.middleware')

//Mostrar todos os utilizadores
router.get('/get', authVerification,controllerUtilizador.getAllUtilizadores);

//Mostrar um utilizador com um determinado id
router.get('/:id/get', authVerification, controllerUtilizador.getUtilizadorById);

//Adicionar um utilizador
router.post('/create', authVerification,controllerUtilizador.createUtilizador);

//Atualizar um utilizador com um determinado id
router.put('/:id/update', authVerification, controllerUtilizador.updateUtilizadorById);

//Mostrar os badges de um utilizador
//router.get('/:id/badges', controllerUtilizador.getAllUsersBadges);
//ENDPOINT NÃO IMPLEMENTADO

//Eliminar um utilizador com um determinado id
router.delete('/:id/delete', authVerification, controllerUtilizador.deleteUtilizadorById);






module.exports = router;