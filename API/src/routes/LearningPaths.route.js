var express = require('express');
var router = express.Router();
var controllerLearningPaths = require('../controllers/LearningPaths.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Mostrar todas as Learning Paths
router.get('/get', controllerLearningPaths.getAllLearningPaths);

// Mostrar uma Learning Path por ID
router.get('/:id/get', controllerLearningPaths.getLearningPathById);

// Criar Learning Path
router.post('/create',authVerification, controllerLearningPaths.createLearningPath);

// Atualizar Learning Path
router.put('/:id/update', controllerLearningPaths.updateLearningPathById);

// Apagar Learning Path
router.delete('/:id/delete', controllerLearningPaths.deleteLearningPathById);

// Mostrar todas as Learning Paths MOBILE
router.get('/get/mobile', controllerLearningPaths.getAllLearningPathsMobile);
router.get('/get/mobile/:id', controllerLearningPaths.getLearningPathByIdMobile);




module.exports = router;