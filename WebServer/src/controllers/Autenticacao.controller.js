var express = require('express');
var router = express.Router();

//Registar um utilizador
router.post('/register', function(req, res, next) {
    res.send('Registar um utilizador');
    //res.json({chave:'valor'});
});

//Autenticar um utilizador
router.post('/login', function(req, res, next) {
    res.send('Autenticar um utilizador');
    //res.json({chave:'valor'});
});

//Obter detalhes de um utilizador autenticado
router.get('/get-me', function(req, res, next) {
     res.send('Obter detalhes de um utilizador autenticado');
    //res.json({chave:'valor'}); 
});

//Editar detalhes de um utilizador autenticado
router.put('/update-me', function(req, res, next) {
     res.send('Editar detalhes de um utilizador autenticado');
    //res.json({chave:'valor'}); 
});

//Eliminar um utilizador autenticado
router.delete('/delete-me', function(req, res, next) {
     res.send('Eliminar um utilizador autenticado');
    //res.json({chave:'valor'}); 
});


module.exports = router;