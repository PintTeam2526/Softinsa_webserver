var express = require("express");
var router = express.Router();
var controllerDocumentos = require("../controllers/Documentos.controller");
var authVerification = require("../middleware/requireAuth.middleware");

router.get("/get", authVerification, controllerDocumentos.getAllDocumentos);
router.get("/:id/get", authVerification, controllerDocumentos.getDocumentoById);
router.get("/pedido/:id_pedido", // Usar esta rota para obter documentos
  authVerification,
  controllerDocumentos.getDocumentosByPedido,
);
router.post("/create", authVerification, controllerDocumentos.createDocumento);
router.put(
  "/:id/update",
  authVerification,
  controllerDocumentos.updateDocumento,
);
router.delete(
  "/:id/delete",
  authVerification,
  controllerDocumentos.deleteDocumento,
);
router.put(
  "/:id/validate",
  authVerification,
  controllerDocumentos.validateDocumento,
);

module.exports = router;
