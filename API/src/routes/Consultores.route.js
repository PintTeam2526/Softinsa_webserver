const express = require('express');
const router = express.Router();
const authVerification = require('../middleware/requireAuth.middleware');

const consultoresController = require('../controllers/Consultores.controller');

router.put('/:id', consultoresController.editarDados);
router.get('/info/:id', consultoresController.getConsultorByIdMobile);
router.get('/count/badgesObtidos/:id', consultoresController.getCountBadgesObtidosByConsultorMobile);
router.get('/count/badgesPorObter/:id', consultoresController.getCountBadgesPorObterMobile);
router.get('/badgesPorObter/lista/:id', consultoresController.getBadgesPorObterMobile);
router.get('/count/objetivos/porCompletar/:id', consultoresController.getCountObjetivosPorConcluirMobile);
router.get('/objetivos/minDiasAteExpirar/:id', consultoresController.getDiasObjetivoExpirarMobile);

router.post('/:id/objetivo/create', authVerification, consultoresController.createObjetivo);
router.delete('/:id/objetivo/delete', authVerification, consultoresController.deleteObjetivoById);
router.get('/:id/notificacoes', authVerification, consultoresController.getAllNotificacoes);
router.post('/:id/notificacoes', authVerification, consultoresController.createNotificacao);

module.exports = router;