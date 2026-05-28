var express = require('express');
var router = express.Router();
var controllerDashboard = require('../controllers/Dashboard.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Dashboard Consultor
router.get('/consultor', authVerification, controllerDashboard.consultor);

// Dashboard Talent Manager
router.get('/tm', authVerification, controllerDashboard.talentManager);

// Dashboard Service Line Lider
router.get('/sll', authVerification, controllerDashboard.serviceLineLider);

// Dashboard Administrador
router.get('/admin', authVerification, controllerDashboard.administrador);


module.exports = router;