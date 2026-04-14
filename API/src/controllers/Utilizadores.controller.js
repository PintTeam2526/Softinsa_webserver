const Utilizadores = require('../models/Utilizadores');

const controllers = {};

//Mostrar todos os utilizadores
controllers.getAllUtilizadores = async (req, res) => {
    const resultado = await Utilizadores.findAll(); 
    res.json(resultado);
};

// Mostrar um utilizador com determinado id
controllers.getUtilizadorById = async (req, res) => {
    const id = req.params.id;
    const resultado = await Utilizadores.findByPk(id);
    res.json(resultado);
};

//Criar um utilizador
controllers.createUtilizador = async (req, res) => {
    const resultado = await Utilizadores.create(req.body);
    res.json(resultado);
};

//Apagar um utilizador com determinado id
controllers.deleteUtilizadorById = async (req, res) => {
    const id = req.params.id;
    await Utilizadores.destroy({
        where: { id_utilizador: id }
    });
    res.json({ message: 'Utilizador eliminado' });
};

//Atualizar um utilizador com determinado id 
controllers.updateUtilizadorById = async (req, res) => {
    const id = req.params.id;
    await Utilizadores.update(req.body, {
        where: { id_utilizador: id }
    });
    res.json({ message: 'Utilizador atualizado' });
};



module.exports = controllers;