var express = require("express");
var router = express.Router();
var controllerSyncMobile = require("../controllers/SyncMobile.controller");
var authVerification = require("../middleware/requireAuth.middleware");

router.get("/servicelines", controllerSyncMobile.syncServiceLinesMobile);
router.get("/conquistas", controllerSyncMobile.syncConquistasMobile);
router.get("/areas", controllerSyncMobile.syncAreasMobile);
router.get("/learningpaths", controllerSyncMobile.syncLearningPathsMobile);
router.get("/badges", controllerSyncMobile.syncBadgesMobile);
router.get("/estados", controllerSyncMobile.syncEstadosMobile);
router.get("/badgesConcluidos/:id",controllerSyncMobile.syncBadgesConcluidosMobile,);
router.get("/pedidosBadges/:id", controllerSyncMobile.syncPedidosBadgesMobile);
router.get("/historicoPedidos/:id",controllerSyncMobile.syncHistoricoPedidosMobile,);
router.get("/objetivos/:id", controllerSyncMobile.syncObjetivosMobile);
router.get("/requisitos", controllerSyncMobile.syncRequisitosMobile);
router.get("/documentacoes/:id", controllerSyncMobile.syncDocumentacoesMobile);
router.get("/conquistasConsultores/:idConsultor", controllerSyncMobile.syncConquistasConsultores);

module.exports = router;
