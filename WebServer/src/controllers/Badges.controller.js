var express = require('express');
var router = express.Router();
var modeloBadges = require('../models/Badges.model');

//Mostrar todos os badges
router.get('/show', async function(req, res) {
    var resposta = await modeloBadges.getAllBadges();
    res.json(resposta.rows);
});

//Mostrar um badge com um determinado id
router.get('/show/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloBadges.getBadgeByID(id);
    res.json(resposta.rows);  
});

//Adicionar badges
router.post('/create', function(req, res, next) {
     res.send('Adicionar badges');
    //res.json({chave:'valor'}); 
});

//Atualizar um badge com um determinado id
router.put('/update/:id', function(req, res, next) {
     res.send('Atualizar um badge com um determinado id');
    //res.json({chave:'valor'}); 
});

//Eliminar um badge com um determinado id
router.delete('/delete/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloBadges.deleteBadgeByID(id);
    res.json(resposta.rows);  
});

//Mostrar um requisito com um determinado id associado a um badge com um determinado id
router.get('/:id/requisitos/show/:id', function(req, res, next) {
     res.send('Mostrar um requisito com um determinado id associado a um badge com um determinado id');
    //res.json({chave:'valor'}); 
});

//Criar um requisito associado a um badge com um determinado id
router.post('/:id/requisitos/create', function(req, res, next) {
     res.send('Criar um requisito associado a um badge com um determinado id');
    //res.json({chave:'valor'}); 
});


module.exports = router;
