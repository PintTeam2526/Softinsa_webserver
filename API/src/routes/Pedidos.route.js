var express = require('express');
var router = express.Router();
var modeloPedidos = require('../controllers/Pedidos.controller');

// Mostrar todos os pedidos
router.get('/show', modeloPedidos.getAllPedidos);

// Mostrar pedido por ID
router.get('/show/:id', modeloPedidos.getPedidoByID);

// Criar pedido
router.post('/create', modeloPedidos.createPedido);

// Atualizar pedido
router.put('/update/:id', modeloPedidos.updatePedido);

// Apagar pedido
router.delete('/delete/:id', modeloPedidos.deletePedidoByID);

// Avaliação do Talent Manager
router.post('/:id/tm-review', modeloPedidos.tmReview);

// Avaliação do Service Line Leader
router.post('/:id/sl-review', modeloPedidos.slReview);

// Reenviar pedido
router.post('/:id/resubmit', modeloPedidos.resubmitPedido);

module.exports = router;