// OPCIONAL (VER SE PRECISAMOS)

var express = require('express');
var router = express.Router();
var modeloDocumentos = require('../models/Documentos.model');

//Adicionar um documento
router.post('/create', function(req, res, next) {
    res.send('Adicionar um documento');
    //res.json({chave:'valor'});
});

//Eliminar um documento com um determinado id
router.delete('/delete/:id', function(req, res, next) {
    res.send('Eliminar um documento com um determinado id');
    //res.json({chave:'valor'});
});


module.exports = router;