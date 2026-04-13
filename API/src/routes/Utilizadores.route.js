var express = require('express');
var router = express.Router();
var modeloUtilizador = require('../models/Utilizadores.model')

//Mostrar todos os utilizadores
router.get('/show', async function(req, res) {
    var resposta = await modeloUtilizador.getAllUsers();
    res.json(resposta.rows);
});

//Mostrar um utilizador com um determinado id
router.get('/show/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloUtilizador.getUserByID(id);
    res.json(resposta.rows);
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
router.delete('/delete/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloUtilizador.getUserByID(id);
    res.json(resposta.rows);
});

module.exports = router;