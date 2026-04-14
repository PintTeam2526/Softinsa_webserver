var express = require('express');
var router = express.Router();
var controllerObjetivos = require('../controllers/Objetivos.controller');

// Apagar um objetivo
router.delete('/delete/:id', controllerObjetivos.deleteObjetivos);


module.exports = router;