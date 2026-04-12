var express = require('express');
var router = express.Router();

//Mostrar todas as service lines
router.get('/show', function(req, res, next) {
    res.send('Mostrar todas as service lines');
    //res.json({chave:'valor'});
});

//Adicionar service lines
router.post('/create', function(req, res, next) {
    res.send('Adicionar service lines');
    //res.json({chave:'valor'});
});

//Mostrar uma service line com um determinado id
router.get('/show/:id', function(req, res, next) {
    res.send('Mostrar uma service line com um determinado id');
    //res.json({chave:'valor'});    
});

//Atualizar uma service line com um determinado id
router.put('/update/:id', function(req, res, next) {
    res.send('Atualizar uma service line com um determinado id');
    //res.json({chave:'valor'});  
});

//Eliminar uma service line com um determinado id
router.delete('/delete/:id', function(req, res, next) {
    res.send('Eliminar uma service line com um determinado id');
    //res.json({chave:'valor'}); 
});


module.exports = router;