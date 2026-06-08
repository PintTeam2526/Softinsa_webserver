const Notificacoes = require('../models/Notificacoes.models');

async function notificarEstado(nome, tipo, ativo) {
    const estado = ativo ? "ativado" : "desativado";
    await Notificacoes.create({
        id_consultor: null,
        notificacao: `${tipo} ${estado}`,
        descricao: `O ${tipo.toLowerCase()} "${nome}" foi ${estado}.`,
        remetente: "Sistema",
        data_de_envio: new Date()
    });
}

module.exports = { notificarEstado };