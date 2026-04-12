var express = require('express');
var router = express.Router();
var modeloUtilizador = require('../models/Utilizadores.model')

//Mostrar todos os utilizadores
router.get('/show', async function(req, res, next) {
    var resposta = await modeloUtilizador.getAllUsers();
    res.json(resposta.rows);
    //res.send('Mostrar todos os utilizadores');
});

//Mostrar um utilizador com um determinado id
router.get('/show/:id', function(req, res, next) {
    res.send('Mostrar um utilizador com um determinado id');
    //res.json({chave:'valor'});
});

//Adicionar um utilizador
router.post('/create', function(req, res, next) {
    res.send('Adicionar um utilizador');
    //res.json({chave:'valor'});
});

//Atualizar um utilizador com um determinado id
router.put('/update/:id', function(req, res, next) {
    res.send('Atualizar um utilizador com um determinado id');
    //res.json({chave:'valor'});
});

//Eliminar um utilizador com um determinado id
router.put('/delete/:id', function(req, res, next) {
    res.send('Eliminar um utilizador com um determinado id');
    //res.json({chave:'valor'});
});

module.exports = router;