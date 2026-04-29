const Badges = require('../models/Badges.models');

const controllers = {};

//Mostrar todos os badges
controllers.getAllBadges = async (req, res) => {
    const resultado = await Badges.findAll(); 
    res.json(resultado);
};

// Mostrar um badge com determinado id
controllers.getBadgeById = async (req, res) => {
    const id = req.params.id;
    const resultado = await Badges.findByPk(id);
    res.json(resultado);
};

//Criar um badge
controllers.createBadge = async (req, res) => {
    const resultado = await Badges.create(req.body);
    res.json(resultado);
};

//Apagar um badge com determinado id
controllers.deleteBadgeById = async (req, res) => {
    const id = req.params.id;
    await Badges.destroy({
        where: { id_badge: id }
    });
    res.json({ message: 'Badge eliminado' });
};

//Atualizar um badge com determinado id 
controllers.updateBadgeById = async (req, res) => {
    const id = req.params.id;
    await Badges.update(req.body, {
        where: { id_badge: id }
    });
    res.json({ message: 'Badge atualizado' });
};



module.exports = controllers;