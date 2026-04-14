var express = require('express');
var router = express.Router();
var controllerDocumentos = require('../controllers/Documentos.controller');

// Eliminar um documento por ID
router.delete('/delete/:id', controllerDocumentos.deleteDocumentoByID);

module.exports = router;