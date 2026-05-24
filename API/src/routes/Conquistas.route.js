var express = require("express");
var router = express.Router();
var controllerConquistas = require("../controllers/Conquistas.controller");
var authVerification = require("../middleware/requireAuth.middleware");

// Mostrar todas as conquistas de um consultor
router.get("/get/consultor", controllerConquistas.getConquistaByIdConsultor);

// CONQUISTAS MOBILE
router.get('/mobile/get/conquistas', controllerConquistas.getListaConquistasMobile);
// -> fazer rota de count(*) das conquistas obtidos por x consultor para (ecra_principal)

module.exports = router;
