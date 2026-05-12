const editarDadosService = require('../services/editarDados.service');

async function editarDados(req, res) {

    try {
        const resultado =
            await editarDadosService.editarDadosConsultor({
                id_consultor: req.params.id,
                nome: req.body.nome,
                email: req.body.email,
                id_area: req.body.id_area,
                foto_perfil: req.body.foto_perfil,
                password: req.body.password
            });
        res.json(resultado);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });

    }
}

module.exports = {
    editarDados
};