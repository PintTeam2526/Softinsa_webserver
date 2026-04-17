var express = require('express');
var router = express.Router();
var controllerPedidos = require('../controllers/Pedidos.controller');
var authVerification = require('../middleware/requireAuth.middleware')

// Mostrar todos os pedidos
router.get('/get',authVerification, controllerPedidos.getAllPedidos);

// Mostrar pedido por ID
router.get('/get/:id', authVerification,controllerPedidos.getPedidoByID);

// Criar pedido
router.post('/create', authVerification,controllerPedidos.createPedido);

// Atualizar pedido
router.put('/update/:id', authVerification,controllerPedidos.updatePedidoByID);

// Apagar pedido
router.delete('/delete/:id', authVerification,controllerPedidos.deletePedidoByID);

// Avaliação do Talent Manager
router.post('/tm-review/:id', authVerification,controllerPedidos.tmReview);

// Avaliação do Service Line Leader e do admin
router.post('/sl-review/:id',authVerification, controllerPedidos.slReview);

// Reenviar pedido
router.post('/resubmit/:id', authVerification,controllerPedidos.resubmitPedido);

module.exports = router;