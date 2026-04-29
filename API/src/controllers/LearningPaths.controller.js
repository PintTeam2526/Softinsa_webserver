const LearningPaths = require('../models/LearningPaths.models');

const controllers = {};

//Mostrar todas as LP
controllers.getAllLearningPaths = async (req, res) => {
    const resultado = await LearningPaths.findAll(); 
    res.json(resultado);
};

// Mostrar uma LP com determinado id
controllers.getLearningPathById = async (req, res) => {
    const id = req.params.id;
    const resultado = await LearningPaths.findByPk(id);
    res.json(resultado);
};

//Criar uma LP
controllers.createLearningPath = async (req, res) => {
    const resultado = await LearningPaths.create(req.body);
    res.json(resultado);
};

//Apagar uma LP com determinado id
controllers.deleteLearningPathById = async (req, res) => {
    const id = req.params.id;
    await LearningPaths.destroy({
        where: { id_learningpath: id }
    });
    res.json({ message: 'Learning Path eliminada' });
};

//Atualizar uma LP com determinado id 
controllers.updateLearningPathById = async (req, res) => {
    const id = req.params.id;
    await LearningPaths.update(req.body, {
        where: { id_learningpath: id }
    });
    res.json({ message: 'Learning Path atualizada' });
};



module.exports = controllers;
