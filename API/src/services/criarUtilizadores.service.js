const sequelize = require('../../database');
const Utilizadores = require('../models/Utilizadores.models');
const Consultores = require('../models/Consultores.models');
const TalentManagers = require('../models/TalentManagers.models');
const ServiceLineLiders = require('../models/ServiceLineLiders.models');

async function criarUtilizador({
    nome_utilizador,
    email_utilizador,
    password_utilizador,
    username_utilizador,
    tipo_utilizador,
    imagem_utilizador,
    id_area,
    id_service_line
}) {

    const transaction =
        await sequelize.transaction();

    try {

        // Verificar username existente
        const usernameExistente = await Utilizadores.findOne({
            where: {username_utilizador},
            transaction
        });

        if (usernameExistente) {
            throw new Error('ERRO! O username_utilizador já existe!');
        }

        // Criar utilizador
        const novoUtilizador = await Utilizadores.create({
            nome_utilizador,
            email_utilizador,
            password_utilizador,
            username_utilizador,
            tipo_utilizador,
            imagem_utilizador,
            estado_a_i: true
        }, { transaction });

        // CONSULTOR
        if (tipo_utilizador === 'c') {
            if (!id_area) {
                throw new Error('O id_area é obrigatório para consultores');
            }

            await Consultores.create({
                id_utilizador: novoUtilizador.id_utilizador,
                total_pontos: 0,
                id_area
            }, { transaction });
        }

        // TALENT MANAGER
        else if (tipo_utilizador === 'tm') {
            await TalentManagers.create({
                id_utilizador: novoUtilizador.id_utilizador
            }, { transaction });
        }

        // SERVICE LINE LIDER
        else if (tipo_utilizador === 'sl') {
            if (!id_service_line) {
                throw new Error('O id_service_line é obrigatório para service line liders');
            }

            await ServiceLineLiders.create({
                id_utilizador: novoUtilizador.id_utilizador,
                id_service_line
            }, { transaction });
        }

        // Tipo inválido
        else {
            throw new Error('Tipo de utilizador inválido');
        }

        await transaction.commit();

        return {
            success: true,
            message: 'Utilizador criado com sucesso',
            id_utilizador: novoUtilizador.id_utilizador
        };

    } catch (err) {
        await transaction.rollback();
        throw err;
    }
}

module.exports = {criarUtilizador};