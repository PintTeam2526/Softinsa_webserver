var express = require('express');
var router = express.Router();
var controllerBadges = require('../controllers/Badges.controller');
var authVerification = require('../middleware/requireAuth.middleware');
const controller = require('../controllers/Dashboard.controller');

// Mostrar todos os badges
router.get('/get', controllerBadges.getAllBadges);

// Mobile
router.get('/', controllerBadges.getAllBadgesMobile);
router.get('/get/mobile', controllerBadges.getAllBadgesMobile);

// Mostrar um badge por ID
router.get('/:id/get', controllerBadges.getBadgeById);

// Adicionar badges
router.post('/create', authVerification, controllerBadges.createBadge);

// Atualizar um badge
router.put('/:id/update', authVerification, controllerBadges.updateBadgeById);

// Eliminar um  badge
router.delete('/:id/delete', authVerification, controllerBadges.deleteBadgeById);

//---------------------------------------------------
// Filtros
//---------------------------------------------------


// Mostrar badges recomendados
router.get("/recomendados", authVerification, controllerBadges.getBadgesRecomendados);

// Mostrar badges em analize
router.get("/emAnalize", authVerification, controllerBadges.badgesEmAnalize);

// Mostrar badges obtidos
router.get("/obtidos", authVerification, controllerBadges.badgesObtidos);

//Mostrar badges favoritos 
router.get("/favorito", authVerification, controllerBadges.getFavorito);

// Colocar badge como favorito(colocar variavel set boleana no body)
router.post("/favorito/set", authVerification, controllerBadges.setFavorito);

// Mostrar badges por obter
router.get("/porObter", authVerification, controllerBadges.porObter)

// Mostrar badges de pedidos expirados
router.get("/expirados", authVerification, controllerBadges.expirados)

// Mostrar badges de pedidos devolvidos
router.get("/devolvidos", authVerification, controllerBadges.devolvidos)

// Devolver estado do badge
router.get('/:id_badge/consultor/:id_consultor/estado', controllerBadges.devolverEstadoBadge);
router.get('/mobile/:id_badge/consultor/:id_consultor/estado', controllerBadges.devolverEstadoBadgeMobile);

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
//router.put('/:badgeId/requisitos/:id/update', controllerBadges.updateRequisitoById);


//MOBILE
router.get('/get/area/:id', controllerBadges.getBadgesByAreaIDMobile);
router.get('/get/:id', controllerBadges.getBadgeByIdMobile);
router.get('/get/obtidos/:id', controllerBadges.getBadgesObtidosConsultorMobile);

//rota de Linkdin
router.get('/:id/share', controllerBadges.getBadgeShareHtml);


module.exports = router;
