var express = require('express');
var router = express.Router();
var controllerRequisitos = require('../controllers/Requisitos.controller');
var authVerification = require('../middleware/requireAuth.middleware');

router.get('/get', authVerification, controllerRequisitos.getAllRequisitos);
router.get('/get/badge/:id', controllerRequisitos.getRequisitosBadgeMobile);
router.get('/:id/get', authVerification, controllerRequisitos.getRequisitoById);
router.post('/create', authVerification, controllerRequisitos.createRequisito);
router.put('/:id/update', authVerification, controllerRequisitos.updateRequisito);
router.delete('/:id/delete', authVerification, controllerRequisitos.deleteRequisito);

module.exports = router;
