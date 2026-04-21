const Conquistas = require('../models/Conquistas');

const controllers = {};

//Mostrar todas as conquistas
controllers.getAllConquistas = async (req, res) => {
    const resultado = await Conquistas.findAll(); 
    res.json(resultado);
};

// Mostrar uma conquista com determinado id
controllers.getConquistaById = async (req, res) => {
    const id = req.params.id;
    const resultado = await Conquistas.findByPk(id);
    res.json(resultado);
};

//Criar uma conquista
controllers.createConquista = async (req, res) => {
    const resultado = await Conquistas.create(req.body);
    res.json(resultado);
};

//Apagar uma conquista com determinado id
controllers.deleteConquistaById = async (req, res) => {
    const id = req.params.id;
    await Conquistas.destroy({
        where: { id_conquista: id }
    });
    res.json({ message: 'Conquista eliminada' });
};

//Atualizar uma conquista com determinado id 
controllers.updateConquistaById = async (req, res) => {
    const id = req.params.id;
    await Conquistas.update(req.body, {
        where: { id_conquista: id }
    });
    res.json({ message: 'Conquista atualizada' });
};


module.exports = controllers;