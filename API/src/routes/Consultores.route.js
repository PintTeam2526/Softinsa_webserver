const express = require('express');
const router = express.Router();

const consultoresController = require('../controllers/Consultores.controller');

router.put('/:id', consultoresController.editarDados);

module.exports = router;