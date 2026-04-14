const Pedidos = require('../models/Pedidos');

const controllers = {};

//Mostrar todos os pedidos
controllers.getAllPedidos = async (req, res) => {
    const resultado = await Pedidos.findAll(); 
    res.json(resultado);
};

// Mostrar um pedido com determinado id
controllers.getPedidoById = async (req, res) => {
    const id = req.params.id;
    const resultado = await Pedidos.findByPk(id);
    res.json(resultado);
};

//Criar um pedido
controllers.createPedido = async (req, res) => {
    const resultado = await Pedidos.create(req.body);
    res.json(resultado);
};

//Apagar um pedido com determinado id
controllers.deletePedidoById = async (req, res) => {
    const id = req.params.id;
    await Pedidos.destroy({
        where: { id_pedido: id }
    });
    res.json({ message: 'Pedido eliminado' });
};

//Atualizar um pedido com determinado id 
controllers.updatePedidoById = async (req, res) => {
    const id = req.params.id;
    await Pedidos.update(req.body, {
        where: { id_pedido: id }
    });
    res.json({ message: 'Pedido atualizado' });
};



module.exports = controllers;