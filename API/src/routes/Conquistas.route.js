var express = require("express");
var router = express.Router();
var controllerConquistas = require("../controllers/Conquistas.controller");
var authVerification = require("../middleware/requireAuth.middleware");

// Mostrar todas as conquistas de um consultor
router.get('/get/consultor', authVerification, controllerConquistas.getConquistaByIdConsultor);

// CONQUISTAS MOBILE
router.get('/mobile/get/:idConsultor', controllerConquistas.getListaConquistasByIdConsultorMobile);
router.get('/mobile/count/:idConsultor', controllerConquistas.getCountConquistasObtidasMobile);
module.exports = router;
