var express = require('express');
var router = express.Router();

//Mostrar todas as areas
router.get('/show-all', function(req, res, next) {
    res.send('Mostrar todas as areas');
    //res.json({chave:'valor'});
});

//Adicionar areas
router.post('/create', function(req, res, next) {
    res.send('Adicionar areas');
    //res.json({chave:'valor'});
});

//Mostrar uma area com determinado id
router.get('/show/:id', function(req, res, next) {
    res.send('Mostrar uma area com determinado id');
    //res.json({chave:'valor'});   
});

//Atualizar uma area com determinado id
router.put('/update/:id', function(req, res, next) {
    res.send('Atualizar uma area com determinado id');
    //res.json({chave:'valor'});
});

//Apagar uma area com determinado id
router.delete('/delete/:id', function(req, res, next) {
    res.send('Apagar uma area com determinado id');
    //res.json({chave:'valor'});
});


module.exports = router;