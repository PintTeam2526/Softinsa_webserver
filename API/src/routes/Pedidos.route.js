var express = require('express');
var router = express.Router();
var controllerPedidos = require('../controllers/Pedidos.controller');

// Mostrar todos os pedidos
router.get('/get', controllerPedidos.getAllPedidos);

// Mostrar pedido por ID
router.get('/get/:id', controllerPedidos.getPedidoByID);

// Criar pedido
router.post('/create', controllerPedidos.createPedido);

// Atualizar pedido
router.put('/update/:id', controllerPedidos.updatePedido);

// Apagar pedido
router.delete('/delete/:id', controllerPedidos.deletePedidoByID);

// Avaliação do Talent Manager
router.post('/tm-review/:id', controllerPedidos.tmReview);

// Avaliação do Service Line Leader e do admin
router.post('/sl-review/:id', controllerPedidos.slReview);

// Reenviar pedido
router.post('/resubmit/:id', controllerPedidos.resubmitPedido);

module.exports = router;