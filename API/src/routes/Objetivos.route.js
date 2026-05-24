var express = require('express');
var router = express.Router();
var controllerObjetivos = require('../controllers/Objetivos.controller');
var authVerification = require('../middleware/requireAuth.middleware');

router.get('/get/:id', controllerObjetivos.getObjetivosConsultorMobile);
router.get('/badgesDisponiveis/:id', controllerObjetivos.badgesParaObjetivosMobile);
router.post('/adicionar', controllerObjetivos.criarObjetivoConsultorMobile);

router.get('/meus', authVerification, controllerObjetivos.getObjetivosConsultor);
router.get('/badges-disponiveis', authVerification, controllerObjetivos.badgesParaObjetivos);
router.post('/criar', authVerification, controllerObjetivos.criarObjetivoConsultor);

module.exports = router;
