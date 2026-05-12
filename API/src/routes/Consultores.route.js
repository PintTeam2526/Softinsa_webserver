const express = require('express');
const router = express.Router();

const consultoresController = require('../controllers/consultores.controller');

router.put('/:id', consultoresController.editarDados);

module.exports = router;