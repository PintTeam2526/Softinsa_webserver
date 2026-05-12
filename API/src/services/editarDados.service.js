const sequelize = require('../../database');

const Consultores = require('../models/Consultores.models');
const Utilizadores = require('../models/Utilizadores.models');

async function editarDadosConsultor({
    id_consultor,
    nome = null,
    email = null,
    id_area = null,
    foto_perfil = null,
    password = null
}) {

    const transaction = await sequelize.transaction();

    try {

        // Procurar consultor
        const consultor = await Consultores.findOne({
            where: {
                id_consultor
            },
            transaction
        });

        if (!consultor) {
            throw new Error('Consultor não encontrado');
        }

        // Atualizar utilizador
        const dadosUtilizador = {};

        if (nome !== null) {
            dadosUtilizador.nome_utilizador = nome;
        }
        if (email !== null) {
            dadosUtilizador.email_utilizador = email;
        }
        if (foto_perfil !== null) {
            dadosUtilizador.imagem_utilizador = foto_perfil;
        }
        if (password !== null) {
            dadosUtilizador.password_utilizador = password;
        }

        // Atualizar utilizador
         await Utilizadores.update(
                dadosUtilizador,
                {
                    where: {
                        id_utilizador:consultor.id_utilizador
                    },
                    transaction
                }
            );

        // Atualizar área
        if (id_area !== undefined) {

            await Consultores.update(
                {
                    id_area
                },
                {
                    where: {
                        id_consultor
                    },
                    transaction
                }
            );
        }

        await transaction.commit();

        return {
            success: true,
            message: 'Dados atualizados com sucesso'
        };

    } catch (err) {

        await transaction.rollback();
        throw err;

    }
}

module.exports = {editarDadosConsultor};