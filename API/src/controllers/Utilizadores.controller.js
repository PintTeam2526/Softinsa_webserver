const bcrypt = require('bcrypt');
const Utilizadores = require('../models/Utilizadores.models');
const criarUtilizadoresService = require('../services/criarUtilizadores.service');

const controllers = {};

// Mostrar todos os utilizadores
controllers.getAllUtilizadores = async (req, res) => {
    try {
        const isConsultor = req.user?.role === "c";

        if (isConsultor) {
            const resultado = await Utilizadores.findByPk(req.user.id);

            return res.status(200).json([resultado]);
        }

        const resultado = await Utilizadores.findAll();

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Não existem utilizadores"
            });
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar utilizadores",
            erro: error.message
        });
    }
};

// Mostrar utilizador por ID
controllers.getUtilizadorById = async (req, res) => {
    try {
        const id = req.params.id;
        const isConsultor = req.user?.role === "c";

        if (isConsultor && req.user.id != id) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const resultado = await Utilizadores.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Utilizador não existe"
            });
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar utilizador",
            erro: error.message
        });
    }
};

//Criar um utilizador (usa o service criar utilizadores)
controllers.createUtilizador = async (req, res) => {
    try {
        const resultado = await criarUtilizadoresService.criarUtilizador(req.body);
        res.status(201).json(resultado);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// Eliminar utilizador
controllers.deleteUtilizadorById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;
        const utilizador = await Utilizadores.findByPk(id);

        if (!utilizador) {
            return res.status(404).json({
                mensagem: "Utilizador não existe"
            });
        }

        utilizador.estado_a_i = false;
        await utilizador.save();

        return res.status(200).json({
            mensagem: "Utilizador eliminado"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao eliminar utilizador",
            erro: error.message
        });
    }
};

// Atualizar utilizador
controllers.updateUtilizadorById = async (req, res) => {
    try {
        const id = req.params.id;

        const isAdmin = req.user?.role === "a";
        const isConsultor = req.user?.role === "c";

        if (isConsultor && req.user.id != id) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const utilizador = await Utilizadores.findByPk(id);

        if (!utilizador) {
            return res.status(404).json({
                mensagem: "Utilizador não existe"
            });
        }

        const {
            nome_utilizador,
            email_utilizador,
            password_utilizador,
            username_utilizador,
            tipo_utilizador,
            imagem_utilizador,
            estado_a_i
        } = req.body;

        // Só admin pode alterar cargos
        if (tipo_utilizador && !isAdmin) {
            return res.status(401).json({
                mensagem: "Só administradores podem alterar cargos"
            });
        }

        utilizador.nome_utilizador = nome_utilizador ?? utilizador.nome_utilizador;
        utilizador.email_utilizador = email_utilizador ?? utilizador.email_utilizador;
        utilizador.password_utilizador = password_utilizador
            ? await bcrypt.hash(password_utilizador, 10)
            : utilizador.password_utilizador;
        utilizador.username_utilizador = username_utilizador ?? utilizador.username_utilizador;
        utilizador.imagem_utilizador = imagem_utilizador ?? utilizador.imagem_utilizador;
        utilizador.estado_a_i = estado_a_i ?? utilizador.estado_a_i;

        if (isAdmin && tipo_utilizador) {
            utilizador.tipo_utilizador = tipo_utilizador;
        }

        await utilizador.save();

        return res.status(200).json({
            mensagem: "Utilizador atualizado com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar utilizador",
            erro: error.message
        });
    }
};

module.exports = controllers;