var express = require('express');
var router = express.Router();
var modeloLearningPaths = require('../controllers/LearningPaths.controller');

//Mostrar todas as Learning Paths
router.get('/show', async function(req, res) {
    var resposta = await modeloLearningPaths.getAllLearningPaths();
    res.json(resposta.rows);
});

//Mostrar um Learning Path com um determinado id
router.get('/show/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloLearnindPaths.getLearningPathByID(id);
    res.json(resposta.rows);   
});

//Adicionar Learning Paths
router.post('/create', function(req, res, next) {
    res.send('Adicionar Learning Paths');
    //res.json({chave:'valor'});
});

//Atualizar um Learning Path com um determinado id
router.put('/update/:id', function(req, res, next) {
    res.send('Atualizar um Learning Path com um determinado id');
    //res.json({chave:'valor'});  
});

//Apagar um Learning Path com um determinado id
router.delete('/delete/:id', async function(req, res) {
    var id = req.params.id;
    var resposta = await modeloLearningPaths.deleteLearningPathByID(id);
    res.json(resposta.rows); 
});



module.exports = router;