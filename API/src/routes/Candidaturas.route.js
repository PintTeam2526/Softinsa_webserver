const express = require('express');
const router = express.Router();

const candidaturaController = require('../controllers/Candidaturas.controller');

router.post('/', candidaturaController.submeterCandidatura);

module.exports = router;