const express = require('express');
const router = express.Router();

const candidaturaController = require('../controllers/Candidaturas.controller');



// Rotas Mobile (Submissão faseada)
router.post('/documentacao', candidaturaController.inserirDocumentacaoBadge);
router.post('/candidatar', candidaturaController.candidatarBadge);

module.exports = router;