var express = require('express');
var router = express.Router();

//Mostrar todas as Learning Paths
router.get('/show', function(req, res, next) {
    res.send('Mostrar todas as Learning Paths');
    //res.json({chave:'valor'});
});

//Adicionar Learning Paths
router.post('/create', function(req, res, next) {
    res.send('Adicionar Learning Paths');
    //res.json({chave:'valor'});
});

//Mostrar um Learning Path com um determinado id
router.get('/show/:id', function(req, res, next) {
    res.send('Mostrar uma Learning Path com um determinado id');
    //res.json({chave:'valor'});    
});

//Atualizar um Learning Path com um determinado id
router.put('/update/:id', function(req, res, next) {
    res.send('Atualizar um Learning Path com um determinado id');
    //res.json({chave:'valor'});  
});

//Apagar um Learning Path com um determinado id
router.delete('/delete/:id', function(req, res, next) {
    res.send('Apagar um Learning Path com um determinado id');
    //res.json({chave:'valor'}); 
});


module.exports = router;