var express = require('express');
var router = express.Router();
var controllerDashboard = require('../controllers/Dashboard.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Dashboard Consultor
router.get('/consultor', authVerification, controllerDashboard.consultor);

// Dashboard Talent Manager
//router.get('/tm', authVerification, controllerDashboard.talentmanager);

// Dashboard Service Line Lider
//router.get('/sll', authVerification, controllerDashboard.servicelinelider);

// Dashboard Administrador
//router.get('/admin', authVerification, controllerDashboard.administrador);



// Registar um utilizador
//router.get('/mobile', controllerDashboard.mobile);

// Obter utilizador autenticado
//router.get('/tm', controllerDashboard.getAutenticacao);

// Editar utilizador autenticado
//router.get('/sl', authVerification,controllerDashboard.updateUser);

// Eliminar utilizador autenticado
//router.get('/admin', authVerification,controllerDashboard.deleteUser);

module.exports = router;