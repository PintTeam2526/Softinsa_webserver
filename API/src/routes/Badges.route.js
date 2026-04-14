var express = require('express');
var router = express.Router();
var controllerBadges = require('../controllers/Badges.controller');

// Mostrar todos os badges
router.get('/get', controllerBadges.getAllBadges);

// Mostrar um badge por ID
router.get('/get/:id', controllerBadges.getBadgeByID);

// Criar badge
router.post('/create', controllerBadges.createBadge);

// Atualizar badge
router.put('/update/:id', controllerBadges.updateBadge);

// Apagar badge
router.delete('/delete/:id', controllerBadges.deleteBadgeByID);

// Mostrar requisito de um badge
router.get('/:badgeId/requisitos/:requisitoId', controllerBadges.getRequisito);

// Criar requisito num badge
router.post('/:badgeId/requisitos/create', controllerBadges.createRequisito);

module.exports = router;