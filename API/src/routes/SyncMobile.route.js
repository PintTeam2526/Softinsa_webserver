var express = require("express");
var router = express.Router();
var controllerSyncMobile = require("../controllers/SyncMobile.controller");
var authVerification = require("../middleware/requireAuth.middleware");

router.get("/servicelines", controllerSyncMobile.syncServiceLinesMobile);
router.get("/servicelines/:lastUpdate", controllerSyncMobile.syncServiceLinesMobile);

router.get("/conquistas", controllerSyncMobile.syncConquistasMobile);
router.get("/conquistas/:lastUpdate", controllerSyncMobile.syncConquistasMobile);

router.get("/areas", controllerSyncMobile.syncAreasMobile);
router.get("/areas/:lastUpdate", controllerSyncMobile.syncAreasMobile);

router.get("/learningpaths", controllerSyncMobile.syncLearningPathsMobile);
router.get("/learningpaths/:lastUpdate", controllerSyncMobile.syncLearningPathsMobile);

router.get("/badges", controllerSyncMobile.syncBadgesMobile);
router.get("/badges/:lastUpdate", controllerSyncMobile.syncBadgesMobile);

router.get("/estados", controllerSyncMobile.syncEstadosMobile);
router.get("/estados/:lastUpdate", controllerSyncMobile.syncEstadosMobile);

router.get("/badgesConcluidos/:id", controllerSyncMobile.syncBadgesConcluidosMobile);
router.get("/badgesConcluidos/:id/:lastUpdate", controllerSyncMobile.syncBadgesConcluidosMobile);

router.get("/pedidosBadges/:id", controllerSyncMobile.syncPedidosBadgesMobile);
router.get("/pedidosBadges/:id/:lastUpdate", controllerSyncMobile.syncPedidosBadgesMobile);

router.get("/historicoPedidos/:id", controllerSyncMobile.syncHistoricoPedidosMobile);
router.get("/historicoPedidos/:id/:lastUpdate", controllerSyncMobile.syncHistoricoPedidosMobile);

router.get("/objetivos/:id", controllerSyncMobile.syncObjetivosMobile);
router.get("/objetivos/:id/:lastUpdate", controllerSyncMobile.syncObjetivosMobile);

router.get("/requisitos", controllerSyncMobile.syncRequisitosMobile);
router.get("/requisitos/:lastUpdate", controllerSyncMobile.syncRequisitosMobile);

router.get("/documentacoes/:id", controllerSyncMobile.syncDocumentacoesMobile);
router.get("/documentacoes/:id/:lastUpdate", controllerSyncMobile.syncDocumentacoesMobile);

router.get("/conquistasConsultores/:idConsultor", controllerSyncMobile.syncConquistasConsultores);
router.get("/conquistasConsultores/:idConsultor/:lastUpdate", controllerSyncMobile.syncConquistasConsultores);



module.exports = router;
