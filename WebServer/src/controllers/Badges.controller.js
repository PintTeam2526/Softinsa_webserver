var express = require('express');
var router = express.Router();

//Mostrar todos os badges
router.get('/show', function(req, res, next) {
     res.send('Mostrar todos os badges');
    //res.json({chave:'valor'}); 
});

//Adicionar badges
router.post('/create', function(req, res, next) {
     res.send('Adicionar badges');
    //res.json({chave:'valor'}); 
});

//Mostrar um badge com um determinado id
router.get('/show/:id', function(req, res, next) {
     res.send('Mostrar um badge com um determinado id');
    //res.json({chave:'valor'});    
});

//Atualizar um badge com um determinado id
router.put('/update/:id', function(req, res, next) {
     res.send('Atualizar um badge com um determinado id');
    //res.json({chave:'valor'}); 
});

//Eliminar um badge com um determinado id
router.delete('/delete/:id', function(req, res, next) {
     res.send('Eliminar um badge com um determinado id');
    //res.json({chave:'valor'}); 
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
