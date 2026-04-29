var express = require('express');
var router = express.Router();

var controllerPedidos = require('../controllers/Pedidos.controller');
var authVerification = require('../middleware/requireAuth.middleware');

/* =====================================================
   CONSULTAS
===================================================== */

// Mostrar todos os pedidos
router.get('/get', authVerification, controllerPedidos.getAllPedidos);

// Mostrar pedido por ID
router.get('/:id/get', authVerification, controllerPedidos.getPedidoById);

// Histórico do pedido
router.get('/:id/historico', authVerification, controllerPedidos.getHistoricoPedido);

/* =====================================================
   CONSULTOR
===================================================== */

// Criar pedido
router.post('/create', authVerification, controllerPedidos.createPedido);

// Reenviar pedido após devolução
router.post('/:id/resubmit', authVerification, controllerPedidos.resubmeterPedido);

/* =====================================================
   TALENT MANAGER
===================================================== */

// Aprovar pedido
router.put('/:id/tm/aprovar', authVerification, controllerPedidos.aprovarTM);

// Devolver pedido ao consultor
router.put('/:id/tm/devolver', authVerification, controllerPedidos.devolverTM);

/* =====================================================
   SERVICE LINE LEADER
===================================================== */

// Aprovar pedido final
router.put('/:id/sl/aprovar', authVerification, controllerPedidos.aprovarSL);

// Devolver pedido ao consultor
router.put('/:id/sl/devolver', authVerification, controllerPedidos.devolverSL);

// Rejeitar pedido
router.put('/:id/sl/rejeitar', authVerification, controllerPedidos.rejeitarSL);

module.exports = router;