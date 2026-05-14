const express = require('express');
const router = express.Router();

const consultoresController = require('../controllers/Consultores.controller');
const requireAuth = require('../middleware/requireAuth.middleware');

// Aplicar o middleware de autenticação a todas as rotas deste router
//router.use(requireAuth);

router.put('/:id', consultoresController.editarDados);
router.get('/info/:id', consultoresController.getConsultorByIdMobile);
router.get('/count/badgesObtidos/:id', consultoresController.getCountBadgesObtidosByConsultorMobile);
router.get('/count/badgesPorObter/:id', consultoresController.getCountBadgesPorObterMobile);
router.get('/badgesPorObter/lista/:id', consultoresController.getBadgesPorObterMobile);
router.get('/count/objetivos/porCompletar/:id', consultoresController.getCountObjetivosPorConcluirMobile);
router.get('/objetivos/minDiasAteExpirar/:id', consultoresController.getDiasObjetivoExpirarMobile);

module.exports = router;