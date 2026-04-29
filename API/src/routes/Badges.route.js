var express = require('express');
var router = express.Router();
var controllerBadges = require('../controllers/Badges.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Mostrar todos os badges
router.get('/get', controllerBadges.getAllBadges);

// Mostrar um badge por ID
router.get('/:id/get', controllerBadges.getBadgeById);

// Adicionar badges
router.post('/create', authVerification,controllerBadges.createBadge);

// Atualizar um badge
router.put('/:id/update', controllerBadges.updateBadgeById);

// Eliminar um  badge
router.delete('/:id/delete', controllerBadges.deleteBadgeById);


//AINDA NÃO ESTÃO IMPLEMENTADOS---------------------------------------------------------------------

// Mostrar todos os requisitos de um badge com um id
//router.get('/:badgeID/requisitos',controllerBadges.getAllRequisitos);

// Mostrar um requisito com um id de um badge com um id
//router.get('/:badgeId/requisitos/:id', controllerBadges.getRequisitoById);

// Criar requisito num badge com um id
//router.post('/:badgeId/requisitos/create', authVerification,controllerBadges.createRequisito);

// Eliminar requisito num badge com um id
//router.delete('/:badgeId/requisitos/:id/delete', controllerBadges.deleteRequisitoById);

// Atualizar requisito num badge com um id
//router.update('/:badgeId/requisitos/:id/update', controllerBadges.updateRequisitoById);



module.exports = router;