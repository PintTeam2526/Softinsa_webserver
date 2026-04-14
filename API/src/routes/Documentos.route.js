// OPCIONAL (VER SE PRECISAMOS)
var express = require('express');
var router = express.Router();
var controllerDocumentos = require('../controllers/Documentos.controller');

// Adicionar um documento
router.post('/create', controllerDocumentos.createDocumento);

// Eliminar um documento por ID
router.delete('/delete/:id', controllerDocumentos.deleteDocumentoByID);

module.exports = router;