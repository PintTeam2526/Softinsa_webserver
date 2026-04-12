var express = require('express');
var router = express.Router();
var modeloConquistas = require('../models/Conquistas.model');

//Mostrar todas as conquistas
router.get('/show', async function(req, res) {
    var resposta = await modeloConquistas.getAllConquistas();
    res.json(resposta.rows);
});

//Mostrar uma conquista com determinado id
router.get('/show/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloConquistas.getConquistaByID(id);
    res.json(resposta.rows); 
});

//Eliminar uma conquista com um determinado id
router.delete('/delete/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloConquistas.deleteConquistaByID(id);
    res.json(resposta.rows);  
});

module.exports = router;