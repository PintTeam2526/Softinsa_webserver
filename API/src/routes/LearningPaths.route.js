var express = require('express');
var router = express.Router();
var modeloLearningPaths = require('../controllers/LearningPaths.controller');

// Mostrar todas as Learning Paths
router.get('/show', async function(req, res) {
    const resposta = await modeloLearningPaths.getAllLearningPaths();
    res.json(resposta);
});

// Mostrar uma Learning Path por ID
router.get('/show/:id', modeloLearningPaths.getLearningPathByID);

// Criar Learning Path
router.post('/create', modeloLearningPaths.createLearningPath);

// Atualizar Learning Path
router.put('/update/:id', modeloLearningPaths.updateLearningPath);

// Apagar Learning Path
router.delete('/delete/:id', modeloLearningPaths.deleteLearningPathByID);

module.exports = router;