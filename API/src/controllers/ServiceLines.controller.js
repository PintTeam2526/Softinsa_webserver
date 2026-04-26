const ServiceLines = require('../models/ServiceLines');

const controllers = {};

//Mostrar todas as SL
controllers.getAllServiceLines = async (req, res) => {
    const resultado = await ServiceLines.findAll(); 
    res.json(resultado);
};

// Mostrar uma SL com determinado id
controllers.getServiceLineById = async (req, res) => {
    const id = req.params.id;
    const resultado = await ServiceLines.findByPk(id);
    res.json(resultado);
};

//Criar uma SL
controllers.createServiceLine = async (req, res) => {
    const resultado = await ServiceLines.create(req.body);
    res.json(resultado);
};

//Apagar uma SL com determinado id
controllers.deleteServiceLineById = async (req, res) => {
    const id = req.params.id;
    await ServiceLines.destroy({
        where: { id_service_line: id }
    });
    res.json({ message: 'Service Line eliminada' });
};

//Atualizar uma SL com determinado id 
controllers.updateServiceLineById = async (req, res) => {
    const id = req.params.id;
    await ServiceLines.update(req.body, {
        where: { id_service_line: id }
    });
    res.json({ message: 'Service Line atualizada' });
};



module.exports = controllers;
