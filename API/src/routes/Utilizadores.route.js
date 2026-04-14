var express = require('express');
var router = express.Router();
var modeloUtilizador = require('../controllers/Utilizadores.controller')

//Mostrar todos os utilizadores
router.get('/show', modeloUtilizador.getAllUsers);

//Mostrar um utilizador com um determinado id
router.get('/show/:id', modeloUtilizador.getUserByID);

//Adicionar um utilizador
router.post('/create', modeloUtilizador.createUser);

//Atualizar um utilizador com um determinado id
router.put('/update/:id', modeloUtilizador.updateUserByID);

//Eliminar um utilizador com um determinado id
router.delete('/delete/:id', modeloUtilizador.getUserByID);

module.exports = router;