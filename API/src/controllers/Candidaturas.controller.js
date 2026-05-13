const candidaturaService = require('../services/candidaturas.service');

const controllers = {};

controllers.submeterCandidatura = async (req, res) => {
    try {
        const resultado = await candidaturaService.submeterCandidatura(req.body);
        res.json(resultado);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

module.exports = controllers;