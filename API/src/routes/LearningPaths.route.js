var express = require('express');
var router = express.Router();
var controllerLearningPaths = require('../controllers/LearningPaths.controller');

// Mostrar todas as Learning Paths
router.get('/get', controllerLearningPaths.getAllLearningPaths);

// Mostrar uma Learning Path por ID
router.get('/:id/get', controllerLearningPaths.getLearningPathByID);

// Criar Learning Path
router.post('/create', controllerLearningPaths.createLearningPath);

// Atualizar Learning Path
router.put('/:id/update', controllerLearningPaths.updateLearningPathByID);

// Apagar Learning Path
router.delete('/:id/delete', controllerLearningPaths.deleteLearningPathByID);

module.exports = router;