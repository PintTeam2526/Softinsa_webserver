var express = require('express');
var router = express.Router();
var controllerPedidos = require('../controllers/Pedidos.controller');

// Mostrar todos os pedidos
router.get('/get', controllerPedidos.getAllPedidos);

// Mostrar pedido por ID
router.get('/:id/get', controllerPedidos.getPedidoByID);

// Criar pedido
router.post('/create', controllerPedidos.createPedido);

// Atualizar pedido
router.put('/:id/update', controllerPedidos.updatePedidoByID);

// Apagar pedido
router.delete('/:id/delete', controllerPedidos.deletePedidoByID);

// Avaliação do Talent Manager
router.post('/:id/tm-review', controllerPedidos.tmReview);

// Avaliação do Service Line Leader e do admin
router.post('/:id/sl-review', controllerPedidos.slReview);

// Reenviar pedido
router.post('/:id/resubmit', controllerPedidos.resubmitPedido);

module.exports = router;