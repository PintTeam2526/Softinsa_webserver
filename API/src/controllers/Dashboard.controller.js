const { Op } = require("sequelize");
const objetivos = require('../models/Objetivos.models');
const badgesObtidos = require('../models/BadgesConcluidos.models');
const badges = require('../models/Badges.models');
const utilizador = require('../models/Utilizadores.models');
const consultor = require('../models/Consultores.models');
const area = require('../models/Areas.models')
const dashboardConsultorService = require("../services/dashboardConsultor.service");
const dashboardTalentManagerService = require('../services/dashboardTM.service');
const dashboardServiceLineLiderService = require('../services/dashboardSLL.service');
const dashboardAdministradorService = require('../services/dashboardAdmin.service');
const { listarPedidosPorCargo } = require('../services/listarPedidos.service')

const controller = {};

/*controller.mobile = async (req, res) => {

    try {

        const isConsultor = req.user?.role === "CO";

        if (!isConsultor) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        // DADOS DO CONSULTOR
        const consultorData = await utilizador.findOne({
            where: {
                id_utilizador: req.user.id
            },
            include: [{
                model: consultor,
                include: [{
                    model: area
                }]
            }]
        });
        // OBJETIVOS CONCLUÍDOS
        const objetivosResultado = await objetivos.findAll({
            where: {
                id_consultor: req.user.id,
                data_conclusao_objetivo: {
                    [Op.ne]: null
                }
            }
        });

        const objetivosNum = objetivosResultado.length;

        // BADGES OBTIDOS
        const badgesObtidosResultado = await badgesObtidos.findAll({
            where: {
                id_consultor: req.user.id
            }
        });

        const badgesObtidosNum = badgesObtidosResultado.length;

        // IDS DOS BADGES OBTIDOS
        const idsBadgesObtidos = badgesObtidosResultado.map(
            badge => badge.id_badge
        );

        // BADGES POR OBTER
        const badgesPorObter = await badges.findAll({
            where: {
                estado_a_i: true,
                id_badge: {
                    [Op.notIn]: idsBadgesObtidos
                }
            }
        });

        const badgesPorObterNum = badgesPorObter.length;

        return res.status(200).json({
            consultorData
            utilizador: consultorData.nome_utilizador,
            area: consultorData.consultor.area.nome_area,
            objetivosConcluidos: objetivosNum,
            badgesObtidos: badgesObtidosNum,
            badgesPorObter: badgesPorObterNum
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar utilizadores",
            erro: error.message
        });
    }
};*/

//dashboard Consultor
controller.consultor = async (req, res) => {
    try {
        const isConsultor = req.user?.role === "c";

        if (!isConsultor) {
            return res.status(401).json({ mensagem: "Utilizador não autorizado" });
        }

        const id_consultor = req.user.id_consultor;
        const dadosConsultor = await dashboardConsultorService.getDadosConsultor(id_consultor);
        const diasProximoObjetivo = await dashboardConsultorService.getObjetivoMaisProximo(id_consultor);
        const progressoArea = await dashboardConsultorService.getProgressoArea(id_consultor);
        const progressoServiceLine = await dashboardConsultorService.getProgressoServiceLine(id_consultor);
        const progressoLearningPath = await dashboardConsultorService.getProgressoLearningPath(id_consultor);
        const pedidosBadge = await dashboardConsultorService.getPedidosConsultor(id_consultor);

        const resultado = {
            nome_consultor: dadosConsultor.nome_consultor,
            pontos_consultor: dadosConsultor.pontos_consultor,
            dias_proximo_objetivo: diasProximoObjetivo,
            progresso_area: progressoArea,
            progresso_service_line: progressoServiceLine,
            progresso_learning_path: progressoLearningPath,
            pedidos_badge: pedidosBadge.map(pedido => ({
                nome_badge: pedido.nome_badge,
                estado_pedido: pedido.estado_atual,
                imagem_badge: pedido.imagem_badge
            }))
        }

        res.json(resultado);
    }
    catch(error)
    {
        console.error(error)
        res.status(500).json({mensagem: "Erro de servidor"})
    }
}

// dashboard Talent Manager
controller.talentManager = async (req, res) => {
    try {
        const isTM = req.user?.role === "t";

        if (!isTM) {
            return res.status(401).json({ mensagem: "Utilizador não autorizado" });
        }

        const id_talent_manager = req.user.id_talent_manager;
        const nome = await dashboardTalentManagerService.getNomeTalentManager(id_talent_manager);
        const proximosPedidos = await dashboardTalentManagerService.getProximosPedidosExpirar(id_talent_manager);
        const proximosBadgesExpirar = await dashboardTalentManagerService.getProximosBadgesExpirar();

        const resultado = {
            nome_talent_manager: nome,
            proximos_pedidos: proximosPedidos,
            proximos_badges_expirar: proximosBadgesExpirar
        }

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro de servidor" });
    }
};

// dashboard Service Line Lider
controller.serviceLineLider = async (req, res) => {
    try {
        const isSLL = req.user?.role === "s";

        if (!isSLL) {
            return res.status(401).json({ mensagem: "Utilizador não autorizado" });
        }

        const id_service_line_lider = req.user.id_service_line_lider;
        const nome = await dashboardServiceLineLiderService.getNomeServiceLineLider(id_service_line_lider);
        const serviceLine = await dashboardServiceLineLiderService.getServiceLine(id_service_line_lider);
        const proximosPedidos = await dashboardServiceLineLiderService.getProximosPedidosExpirar(id_service_line_lider);
        const percentagemEstados = await dashboardServiceLineLiderService.getPercentagemEstados(id_service_line_lider);
        const topConsultores = await dashboardServiceLineLiderService.getTopConsultores(id_service_line_lider);
        const totalConsultores = await dashboardServiceLineLiderService.getTotalConsultores(id_service_line_lider);
        const totalBadges = await dashboardServiceLineLiderService.getTotalBadges(id_service_line_lider);

        const resultado = {
            nome_service_line_lider: nome,
            nome_service_line: serviceLine,
            proximos_pedidos: proximosPedidos,
            percentagem_estados: percentagemEstados,
            top_consultores: topConsultores,
            total_consultores: totalConsultores,
            total_badges: totalBadges
        }

        res.json(resultado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro de servidor" });
    }
};

// dashboard Administrador
controller.administrador = async (req, res) => {
    try {
        const isAdministrador = req.user?.role === "a";

        if (!isAdministrador) {
            return res.status(401).json({ mensagem: "Utilizador não autorizado" });
        }

        //se não receber nada têm valores default, ano atual, mês inicial 1 e mês final 12
        const ano = parseInt(req.query.ano) || new Date().getFullYear();
        const mesInicial = parseInt(req.query.mes_inicial) || 1;
        const mesFinal = parseInt(req.query.mes_final) || 12;
        const niveis = ['Júnior', 'Intermédio', 'Sénior', 'Especialista', 'Líder de Conhecimento']
        const numeroBadgesPorNivel = {}
        for (const n of niveis) {
            numeroBadgesPorNivel[n] = await dashboardAdministradorService.getNumeroBadgesObtidosNivel(n)
        }


        const id_administrador = req.user.id_administrador;

        const nome = await dashboardAdministradorService.getNomeAdministrador(id_administrador);
        const totalUtilizadores = await dashboardAdministradorService.getTotalUtilizadores(id_administrador);
        const totalBadges = await dashboardAdministradorService.getTotalBadges(id_administrador);
        const totalAreas = await dashboardAdministradorService.getTotalAreas(id_administrador);
        const totalServiceLines = await dashboardAdministradorService.getTotalServiceLines(id_administrador);
        const totalLearningPaths = await dashboardAdministradorService.getTotaltotalLearningPaths(id_administrador);
        const NumeroBadgesObtidosMesAno = await dashboardAdministradorService.getNumeroBadgesObtidosMesAno(ano, mesInicial, mesFinal);
        const PercentagemBadgesObtidosMesAno = await dashboardAdministradorService.getPercentagemBadgesObtidosMesAno(ano);


        const resultado = {
            nome_administrador: nome,
            total_utilizadores: totalUtilizadores,
            total_badges: totalBadges,
            total_areas: totalAreas,
            total_service_lines: totalServiceLines,
            total_learning_paths: totalLearningPaths,
            numero_badges_obtidos_mes_ano_grafico_1: NumeroBadgesObtidosMesAno,
            numero_badges_obtidos_nivel_grafico_2: numeroBadgesPorNivel,
            percentagem_badges_obtidos_mes_ano_grafico_3: PercentagemBadgesObtidosMesAno
        }

        res.json(resultado);

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensagem: "Erro de servidor" });
    }
};


module.exports = controller;