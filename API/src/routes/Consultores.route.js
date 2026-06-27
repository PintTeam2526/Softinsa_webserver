const express = require('express');
const router = express.Router();
const authVerification = require('../middleware/requireAuth.middleware');

const consultoresController = require('../controllers/Consultores.controller');
const requireAuth = require('../middleware/requireAuth.middleware');

// Aplicar o middleware de autenticação a todas as rotas deste router
//router.use(requireAuth);
router.put('/:id', consultoresController.editarDados);
router.get('/info/:id', authVerification, consultoresController.getConsultorByIdMobile);
router.get('/count/badgesObtidos/:id', authVerification, consultoresController.getCountBadgesObtidosByConsultorMobile);
router.get('/count/badgesPorObter/:id', authVerification, consultoresController.getCountBadgesPorObterMobile);
router.get('/badgesPorObter/lista/:id', authVerification, consultoresController.getBadgesPorObterMobile);
router.get('/count/objetivos/porCompletar/:id', authVerification, consultoresController.getCountObjetivosPorConcluirMobile);
router.get('/objetivos/minDiasAteExpirar/:id', authVerification, consultoresController.getDiasObjetivoExpirarMobile);


router.get('/:id/publico', consultoresController.perfilPublico)
router.get('/sidebar', authVerification, consultoresController.getAreaEBadges);

router.post('/:id/objetivo/create', authVerification, consultoresController.createObjetivo);
router.delete('/:id/objetivo/delete', authVerification, consultoresController.deleteObjetivoById);
router.get('/:id/notificacoes', authVerification, consultoresController.getAllNotificacoes);
router.post('/:id/notificacoes', authVerification, consultoresController.createNotificacao);

//ALTERAR DEFINICOES CONSULTOR MOBILE
router.put('/mobile/update', authVerification, consultoresController.editarDadosConsultorMobile);
module.exports = router;