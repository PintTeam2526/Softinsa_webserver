var express = require('express');
var router = express.Router();
var modeloServiceLines = require('../controllers/ServiceLines.controller');

//Mostrar todas as service lines
router.get('/show', async function(req, res) {
    var resposta = await modeloServiceLines.getAllServiceLines();
    res.json(resposta.rows);
});

//Mostrar uma service line com um determinado id
router.get('/show/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloServiceLines.getServiceLineByID(id);
    res.json(resposta.rows);   
});

//Adicionar service lines
router.post('/create', function(req, res, next) {
    res.send('Adicionar service lines');
    //res.json({chave:'valor'});
});

//Atualizar uma service line com um determinado id
router.put('/update/:id', function(req, res, next) {
    res.send('Atualizar uma service line com um determinado id');
    //res.json({chave:'valor'});  
});

//Eliminar uma service line com um determinado id
router.delete('/delete/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloServiceLines.deleteServiceLineByID(id);
    res.json(resposta.rows); 
});



module.exports = router;