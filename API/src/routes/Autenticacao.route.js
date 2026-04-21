var express = require('express');
var router = express.Router();
var controllerAutenticacao = require('../controllers/Autenticacao.controller');
var middlewareAuth = require('../middleware/auth.middleware')


//AINDA NÃO ESTÃO IMPLEMENTADOS---------------------------------------------------------------------


// Registar um utilizador
router.post('/register', controllerAutenticacao.register);

// Autenticar um utilizador
router.post('/login', middlewareAuth ,controllerAutenticacao.login);

// Obter utilizador autenticado
router.get('/get-me', controllerAutenticacao.getAutenticacao);

// Editar utilizador autenticado
router.put('/update-me', controllerAutenticacao.updateUser);

// Eliminar utilizador autenticado
router.delete('/delete-me', controllerAutenticacao.deleteUser);

module.exports = router;