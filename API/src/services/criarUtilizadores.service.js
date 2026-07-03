const bcrypt = require('bcrypt');
const sequelize = require('../../database');
const Utilizadores = require('../models/Utilizadores.models');
const Consultores = require('../models/Consultores.models');
const Conquistas = require('../models/Conquistas.models');
const TalentManagers = require('../models/TalentManagers.models');
const ServiceLineLiders = require('../models/ServiceLineLiders.models');
const conquistasService = require('../services/conquistas.service');

async function criarUtilizador({ nome_utilizador, email_utilizador, password_utilizador, username_utilizador, tipo_utilizador, imagem_utilizador, id_area, id_service_line }) {

    const transaction = await sequelize.transaction();

    try {
        // Verificar username existente (já tinhas)
        const usernameExistente = await Utilizadores.findOne({
            where: { username_utilizador },
            transaction
        });
        if (usernameExistente) {
            throw new Error('ERRO! O username_utilizador já existe!');
        }

        // Verificar email duplicado (adicionar)
        const emailExistente = await Utilizadores.findOne({
            where: { email_utilizador },
            transaction
        });
        if (emailExistente) {
            throw new Error('ERRO! O email já está a ser utilizado por outro utilizador.');
        }

        // Criar utilizador
        const novoUtilizador = await Utilizadores.create({
            nome_utilizador,
            email_utilizador,
            password_utilizador: await bcrypt.hash(password_utilizador, 10),
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

            const consultor = await Consultores.create({
                id_utilizador: novoUtilizador.id_utilizador,
                total_pontos: 0,
                id_area
            }, { transaction });

            //criar as conquistas do consultor
            //const conquistas = await Conquistas.findAll();

            /*conquistas.forEach(conquista => {
                conquistasService.criarConquista(consultor.id_consultor, conquista.id_conquista);
            });*/
        }

        // TALENT MANAGER
        else if (tipo_utilizador === 't') {
            await TalentManagers.create({
                id_utilizador: novoUtilizador.id_utilizador
            }, { transaction });
        }

        // SERVICE LINE LIDER
        else if (tipo_utilizador === 's') {
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