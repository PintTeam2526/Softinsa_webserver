var express = require('express');
var router = express.Router();

var modeloAreas = require('../models/Areas.model');

//Mostrar todas as areas
router.get('/show', async function(req, res) {
    var resposta = await modeloAreas.getAllAreas();
    res.json(resposta.rows);
});

//Mostrar uma area com determinado id
router.get('/show/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloAreas.getAreaByID(id);
    res.json(resposta.rows); 
});

//Adicionar areas
router.post('/create', function(req, res, next) {
    res.send('Adicionar areas');
    //res.json({chave:'valor'});
});

//Atualizar uma area com determinado id
router.put('/update/:id', function(req, res, next) {
    res.send('Atualizar uma area com determinado id');
    //res.json({chave:'valor'});
});

//Apagar uma area com determinado id
router.delete('/delete/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloAreas.deleteAreaByID(id);
    res.json(resposta.rows); 
});


module.exports = router;