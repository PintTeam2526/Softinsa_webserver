var express = require('express');
var router = express.Router();
var modeloPedidos = require('../controllers/Pedidos.controller');

//Mostrar todos os pedidos
router.get('/show', async function(req, res) {
    var resposta = await modeloPedidos.getAllPedidos();
    res.json(resposta.rows);
});

//Mostrar um pedido com um determinado id
router.get('/show/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloPedidos.getPedidoByID(id);
    res.json(resposta.rows); 
});

//Adicionar pedidos
router.post('/create', function(req, res, next) {
    res.send('Adicionar pedidos');
    //res.json({chave:'valor'});
});

//Atualizar um pedido com um determinado id
router.put('/update/:id', function(req, res, next) {
    res.send('Atualizar um pedido com um determinado id');
    //res.json({chave:'valor'}); 
});

//Apagar um pedido com determinado id
router.delete('/delete/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloPedidos.deletePedidoByID(id);
    res.json(resposta.rows); 
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