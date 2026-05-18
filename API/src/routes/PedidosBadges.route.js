var express = require('express');
var router = express.Router();

var controllerPedidos = require('../controllers/PedidosBadges.controller');
var authVerification = require('../middleware/requireAuth.middleware');

/* =====================================================
   CONSULTAS
===================================================== */

// Mostrar todos os pedidos
router.get('/get', authVerification, controllerPedidos.getAllPedidos);

// Mostrar pedido por ID
router.get('/:id/get', authVerification, controllerPedidos.getPedidoById);

// Histórico do pedido
//router.get('/:id/historico', authVerification, controllerPedidos.getHistoricoPedido);

/* =====================================================
   CONSULTOR
===================================================== */

// Criar pedido
router.post('/create', authVerification, controllerPedidos.createPedido);

// Atualizar pedido
//router.put('/:id/update', controllerPedidos.updatePedidoById);

// Apagar pedido
//router.delete('/:id/delete', controllerPedidos.deletePedidoById);


// Avaliação do Talent Manager
router.post('/:id/tm-review', controllerPedidos.tmReview);

// Avaliação do Service Line Leader e do admin
router.post('/:id/sl-review', controllerPedidos.slReview);

// Reenviar pedido
router.post('/:id/resubmit', controllerPedidos.resubmitPedido);


//MOBILE (MOSTRAR ESTADO DO PEDIDO DO CONSULTOR)
router.get('/estado/consultor/:idConsultor',controllerPedidos.getBadgesCandidatadosMobile);

module.exports = router;
