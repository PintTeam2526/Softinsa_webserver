const Utilizadores = require('../models/Utilizadores.models');
const Objetivos = require('../models/Objetivos.models');
const Notificacoes = require('../models/NotificacoesPedidos.models');
const criarUtilizadoresService = require('../services/criarUtilizadores.service');

const controllers = {};

//Mostrar todos os utilizadores
controllers.getAllUtilizadores = async (req, res) => {
    const resultado = await Utilizadores.findAll(); 
    res.json(resultado);
};

// Mostrar um utilizador com determinado id
controllers.getUtilizadorById = async (req, res) => {
    const id = req.params.id;
    const resultado = await Utilizadores.findByPk(id);
    res.json(resultado);
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

//Apagar um utilizador com determinado id
controllers.deleteUtilizadorById = async (req, res) => {
    const id = req.params.id;
    await Utilizadores.destroy({
        where: { id_utilizador: id }
    });
    res.json({ message: 'Utilizador eliminado' });
};

//Atualizar um utilizador com determinado id 
controllers.updateUtilizadorById = async (req, res) => {
    const id = req.params.id;
    await Utilizadores.update(req.body, {
        where: { id_utilizador: id }
    });
    res.json({ message: 'Utilizador atualizado' });
};

//Adicionar um objetivo do consultor
controllers.createObjetivo = async (req, res) => {
    const idUtilizador = req.params.id;
    const resultado = await Objetivos.create({
        ...req.body, //... serve para copiar tudo o que está dentro do objeto
        id_utilizador: idUtilizador
    });
    res.json(resultado);
};

//Apagar um objetivo do consultor
controllers.deleteObjetivoById = async (req, res) => {
    const id = req.params.id;
    const idUtilizador = req.params.id;
    await Objetivos.destroy({
        where: {
            id_objetivo: id,
            id_utilizador: idUtilizador
        }
    });
    res.json({ message: 'Objetivo eliminado' });
};

// Listar notificações de um utilizador
controllers.getAllNotificacoes = async (req, res) => {
    const idUtilizador = req.params.id;
    const resultado = await Notificacoes.findAll({
        where: {
            id_utilizador: idUtilizador
        }
    });
    res.json(resultado);
};

// Enviar uma notificação
controllers.createNotificacao = async (req, res) => {
    const idUtilizador = req.params.id;
    const resultado = await Notificacoes.create({
        ...req.body, //... serve para copiar tudo o que está dentro do objeto
        id_utilizador: idUtilizador
    });
    res.json(resultado);
};


module.exports = controllers;