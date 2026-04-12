var express = require('express');
var router = express.Router();

//Mostrar todos os pedidos
router.get('/show', function(req, res, next) {
    res.send('Mostrar todos os pedidos');
    //res.json({chave:'valor'});
});

//Adicionar pedidos
router.post('/create', function(req, res, next) {
    res.send('Adicionar pedidos');
    //res.json({chave:'valor'});
});

//Mostrar um pedido com um determinado id
router.get('/show/:id', function(req, res, next) {
    res.send('Mostrar um pedido com um determinado id');
    //res.json({chave:'valor'}); 
});

//Atualizar um pedido com um determinado id
router.put('/update/:id', function(req, res, next) {
    res.send('Atualizar um pedido com um determinado id');
    //res.json({chave:'valor'}); 
});

//Metodo de avaliação do talent manager
router.post('/:id/tm-review', function(req, res, next) {
    res.send('Metodo de avaliação do talent manager');
    //res.json({chave:'valor'});    
});

//Metodo de avaliação do service line lider
router.post('/:id/sl-review', function(req, res, next) {
    res.send('Metodo de avaliação do service line lider');
    //res.json({chave:'valor'}); 
});

//Metodo para o consultor reenviar o pedido caso seja devolvido
router.post('/:id/resubmit', function(req, res, next) {
    res.send('Metodo para o consultor reenviar o pedido caso seja devolvido');
    //res.json({chave:'valor'});    
});

module.exports = router;