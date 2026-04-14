const Areas = require('../models/Areas');

const controllers = {};

//Mostrar todas as área
controllers.getAllAreas = async (req, res) => {
    const resultado = await Areas.findAll(); 
    res.json(resultado);
};

// Mostrar uma área com determinado id
controllers.getAreaById = async (req, res) => {
    const id = req.params.id;
    const resultado = await Areas.findByPk(id);
    res.json(resultado);
};

//Criar uma área
controllers.createArea = async (req, res) => {
    const resultado = await Areas.create(req.body);
    res.json(resultado);
};

//Apagar uma área com determinado id
controllers.deleteAreaById = async (req, res) => {
    const id = req.params.id;
    await Areas.destroy({
        where: { id_area: id }
    });
    res.json({ message: 'Área eliminada' });
};

//Atualizar uma área com determinado id 
controllers.updateAreaById = async (req, res) => {
    const id = req.params.id;
    await Areas.update(req.body, {
        where: { id_area: id }
    });
    res.json({ message: 'Área atualizada' });
};



module.exports = controllers;






