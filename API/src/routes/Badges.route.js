var express = require('express');
var router = express.Router();
var controllerBadges = require('../controllers/Badges.controller');

// Mostrar todos os badges
router.get('/get', controllerBadges.getAllBadges);

// Mostrar um badge por ID
router.get('/get/:id', controllerBadges.getBadgeByID);

// Adicionar badges
router.post('/create', controllerBadges.createBadge);

// Atualizar um badge
router.put('/update/:id', controllerBadges.updateBadgeByID);

// Eliminar um  badge
router.delete('/delete/:id', controllerBadges.deleteBadgeByID);

// Mostrar todos os requisitos de um badge com um id
router.get('/:badgeID/requisitos', controllerBadges.getAllRequisitos);

// Mostrar um requisito com um id de um badge com um id
router.get('/:badgeId/requisitos/:requisitoId', controllerBadges.getRequisitoByID);

// Criar requisito num badge com um id
router.post('/:badgeId/requisitos/create', controllerBadges.createRequisito);

// Eliminar requisito num badge com um id
router.delete('/:badgeId/requisitos/:requisitoId/delete', controllerBadges.deleteRequisitoByID);

// Atualizar requisito num badge com um id
router.update('/:badgeId/requisitos/update/:id', controllerBadges.updateRequisitoByID);



module.exports = router;