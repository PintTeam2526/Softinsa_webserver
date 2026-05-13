var express = require('express');
var router = express.Router();
var controllerDashboard = require('../controllers/Dashboard.controller');


// Registar um utilizador
//router.get('/mobile', controllerDashboard.mobile);

// Autenticar um utilizador
router.get('/consultor' ,controllerDashboard.consultor);

// Obter utilizador autenticado
//router.get('/tm', controllerDashboard.getAutenticacao);

// Editar utilizador autenticado
//router.get('/sl', authVerification,controllerDashboard.updateUser);

// Eliminar utilizador autenticado
//router.get('/admin', authVerification,controllerDashboard.deleteUser);

module.exports = router;