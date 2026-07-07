const Sequelize = require("sequelize");
const sequelize = require("../../database");
const fs = require('fs');
const path = require('path');
const { QueryTypes } = require('sequelize');
const Areas = require('../models/Areas.models');
const ServiceLineLiders = require('../models/ServiceLineLiders.models');
const Consultores = require('../models/Consultores.models');
const Utilizadores = require('../models/Utilizadores.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const Badges = require('../models/Badges.models');
const PedidosBadges = require('../models/PedidosBadges.models');
const Politicas = require('../models/Politicas.models');
const os = require("os");


const controllers = {};

function isAdmin(req) {
    return req.user?.role === "a";
}

function isTM(req) {
    return req.user?.role === "t";
}

function isSL(req) {
    return req.user?.role === "s";
}



controllers.getRGPD = async (req, res) => {
    try {
        const rgpd = await Politicas.findOne({
            attributes: ['politica']
        });

        if (!rgpd) {
            return res.status(404).json({ mensagem: "RGPD não encontrado." });
        }

        return res.status(200).json(rgpd);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao obter RGPD.", erro: error.message });
    }
};

controllers.updateRGPD = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ mensagem: "Acesso negado. Apenas administradores podem atualizar o RGPD." });
        }

        const { politica } = req.body;

        if (!politica) {
            return res.status(400).json({ mensagem: "O conteúdo da política é obrigatório." });
        }

        const rgpd = await Politicas.findOne();

        if (!rgpd) {
            return res.status(404).json({ mensagem: "RGPD não encontrado." });
        }

        rgpd.politica = politica;
        await rgpd.save();

        return res.status(200).json({ mensagem: "RGPD atualizado com sucesso.", dados: rgpd });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao atualizar RGPD.", erro: error.message });
    }
};
controllers.badgesConsultores = async (req, res) => {
    try {
        if (!isTM(req) && !isSL(req)) {
            return res.status(403).json({ mensagem: "Acesso negado. Apenas Talent Managers e Service Line Líderes podem aceder a este recurso." });
        }

        let whereConsultor = {};

        // Se for SLL, filtrar apenas consultores da sua service line
        if (isSL(req)) {
            const sll = await ServiceLineLiders.findOne({
                where: { id_service_line_lider: req.user.id_service_line_lider }
            });

            if (!sll) {
                return res.status(404).json({ mensagem: "Service Line Líder não encontrado." });
            }

            // Buscar áreas que pertencem à service line do SLL
            const areas = await Areas.findAll({
                where: { id_service_line: sll.id_service_line },
                attributes: ['id_area']
            });

            const idsAreas = areas.map(a => a.id_area);

            whereConsultor = {
                id_area: { [Sequelize.Op.in]: idsAreas }
            };
        }

        const consultores = await Consultores.findAll({
            where: whereConsultor,
            include: [
                {
                    model: Utilizadores,
                    attributes: ['nome_utilizador']
                },
                {
                    model: BadgesConcluidos,
                    include: [
                        {
                            model: Badges,
                            attributes: ['nome_badge']
                        }
                    ]
                }
            ]
        });

        const resultado = consultores.map(consultor => ({
            nome: consultor.Utilizadore.nome_utilizador,
            badges: consultor.BadgesConcluidos.map(bc => bc.Badge.nome_badge)
        }));

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao obter badges dos consultores.", erro: error.message });
    }
};

controllers.rankConsultores = async (req, res) => {
    try {
        if (!isTM(req) && !isSL(req)) {
            return res.status(403).json({ mensagem: "Acesso negado. Apenas Talent Managers e Service Line Líderes podem aceder a este recurso." });
        }

        let whereConsultor = {};

        if (isSL(req)) {
            const sll = await ServiceLineLiders.findOne({
                where: { id_service_line_lider: req.user.id_service_line_lider }
            });

            if (!sll) {
                return res.status(404).json({ mensagem: "Service Line Líder não encontrado." });
            }

            const areas = await Areas.findAll({
                where: { id_service_line: sll.id_service_line },
                attributes: ['id_area']
            });

            const idsAreas = areas.map(a => a.id_area);

            whereConsultor = {
                id_area: { [Sequelize.Op.in]: idsAreas }
            };
        }

        const consultores = await Consultores.findAll({
            where: whereConsultor,
            include: [
                {
                    model: Utilizadores,
                    attributes: ['nome_utilizador']
                },
                {
                    model: Areas,
                    attributes: ['nome_area']
                },
                {
                    model: BadgesConcluidos,
                    include: [
                        {
                            model: Badges,
                            attributes: ['id_badge', 'nome_badge', 'id_area']
                        }
                    ]
                }
            ]
        });

        // Para cada consultor, calcular o total de badges da sua área
        const resultado = await Promise.all(consultores.map(async (consultor) => {
            const idArea = consultor.id_area;

            // Total de badges existentes na área do consultor
            const totalBadgesArea = await Badges.count({
                where: { id_area: idArea, estado_a_i: true }
            });

            // Badges concluídos da área do consultor
            const badgesDaArea = consultor.BadgesConcluidos.filter(
                bc => bc.Badge?.id_area === idArea
            );

            const progressoNumerico = totalBadgesArea > 0
                ? Math.round((badgesDaArea.length / totalBadgesArea) * 100)
                : 0;

            return {
                id_consultor: consultor.id_consultor,
                nome: consultor.Utilizadore?.nome_utilizador || "Sem nome",
                area: consultor.Area?.nome_area || "Sem área",
                total_pontos: consultor.total_pontos || 0,
                badges_obtidos: consultor.BadgesConcluidos.length,
                progresso_area: progressoNumerico  // devolve número, ex: 75
            };
        }));

        resultado.sort((a, b) => b.progresso_area - a.progresso_area);

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao obter ranking de consultores.", erro: error.message });
    }
};

controllers.relatorio = async (req, res) => {
    try {
        if (!isAdmin(req) && !isTM(req) && !isSL(req)) {
            return res.status(403).json({ mensagem: "Acesso negado." });
        }

        const { id_area, data_inicio, data_fim } = req.body;

        // Validação extra para SLL — só pode ver áreas da sua service line
        if (isSL(req) && id_area) {
            const sll = await ServiceLineLiders.findOne({  // <-- plural
                where: { id_service_line_lider: req.user.id_service_line_lider }
            });

            if (!sll) {
                return res.status(404).json({ mensagem: "Service Line Líder não encontrado." });
            }

            const areaValida = await Areas.findOne({
                where: {
                    id_area,
                    id_service_line: sll.id_service_line
                }
            });

            if (!areaValida) {
                return res.status(403).json({ mensagem: "Não tens acesso a esta área." });
            }
        }

        // Se for SLL e não filtrou por área, limitar automaticamente às suas áreas
        let whereBadge = {};
        if (isSL(req)) {
            const sll = await ServiceLineLiders.findOne({  // <-- plural
                where: { id_service_line_lider: req.user.id_service_line_lider }
            });

            const areasDaSL = await Areas.findAll({
                where: { id_service_line: sll.id_service_line },
                attributes: ['id_area']
            });

            const idsAreas = areasDaSL.map(a => a.id_area);

            whereBadge.id_area = id_area
                ? id_area  // já validado acima que pertence à SL
                : { [Sequelize.Op.in]: idsAreas };
        } else {
            if (id_area) whereBadge.id_area = id_area;
        }

        // Filtro de datas
        const whereDataConclusao = {};
        if (data_inicio || data_fim) {
            whereDataConclusao.data_conclusao_badge = {};
            if (data_inicio) whereDataConclusao.data_conclusao_badge[Sequelize.Op.gte] = new Date(data_inicio);
            if (data_fim) whereDataConclusao.data_conclusao_badge[Sequelize.Op.lte] = new Date(data_fim);
        }

        const badgesObtidos = await BadgesConcluidos.findAll({
            where: whereDataConclusao,
            include: [
                {
                    model: Badges,
                    where: whereBadge,
                    attributes: ['id_badge', 'nome_badge', 'nivel_badge', 'id_area'],
                    include: [
                        {
                            model: Areas,
                            attributes: ['id_area', 'nome_area']
                        }
                    ]
                }
            ]
        });

        const totalAprovados = badgesObtidos.length;

        const whereRejeitados = { estado_atual: 5 };
        if (data_inicio || data_fim) {
            whereRejeitados.updatedAt = {};
            if (data_inicio) whereRejeitados.updatedAt[Sequelize.Op.gte] = new Date(data_inicio);
            if (data_fim) whereRejeitados.updatedAt[Sequelize.Op.lte] = new Date(data_fim);
        }

        const totalRejeitados = await PedidosBadges.count({
            where: whereRejeitados,
            include: [{ model: Badges, where: whereBadge }]
        });

        const totalBadges = totalAprovados + totalRejeitados;
        const taxaAprovacao = totalBadges > 0 ? Math.round((totalAprovados / totalBadges) * 100) : 0;

        const porArea = {};
        const porNivel = {};
        const detalhes = {};

        for (const bc of badgesObtidos) {
            const badge = bc.Badge;
            const nomeArea = badge.Area?.nome_area ?? 'Desconhecida';
            const nivel = badge.nivel_badge ?? 'Desconhecido';

            porArea[nomeArea] = (porArea[nomeArea] || 0) + 1;
            porNivel[nivel] = (porNivel[nivel] || 0) + 1;

            if (!detalhes[nomeArea]) detalhes[nomeArea] = {};
            detalhes[nomeArea][nivel] = (detalhes[nomeArea][nivel] || 0) + 1;
        }


        const tabelaDetalhes = Object.entries(detalhes).map(([area, nivelMap]) => {
            const linha = { area };
            let total = 0;
            for (const nivel of Object.keys(nivelMap)) {
                linha[nivel] = nivelMap[nivel] || 0;
                total += linha[nivel];
            }
            linha.total = total;
            return linha;
        });

        const totalParaPercentagem = totalAprovados > 0 ? totalAprovados : 1;

        return res.status(200).json({
            resumo: {
                total_badges: totalBadges,
                badges_aprovados: totalAprovados,
                badges_rejeitados: totalRejeitados,
                taxa_aprovacao: taxaAprovacao
            },
            distribuicao_por_area: Object.entries(porArea).map(([nome, total]) => ({
                nome,
                total,
                percentagem: Math.round((total / totalParaPercentagem) * 100)
            })),
            distribuicao_por_nivel: Object.entries(porNivel).map(([nome, total]) => ({
                nome,
                total,
                percentagem: Math.round((total / totalParaPercentagem) * 100)
            })),
            detalhes: tabelaDetalhes,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao gerar relatório.", erro: error.message });
    }
};

controllers.BDWipe = async (req, res) => {
    try {
        if (!isAdmin(req)) {
            return res.status(403).json({ mensagem: "Acesso negado. Apenas administradores podem limpar a base de dados." });
        }

        // Drop + recria as tabelas a partir dos models — sequences renascem em 1
        await sequelize.sync({ force: true });

        const sqlPath = path.join(__dirname, '../../sql/seed.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        await sequelize.query(sql);

        console.log('✅ Base de dados limpa e repopulada com sucesso!');

        return res.status(200).json({ mensagem: "Base de dados limpa e repopulada com sucesso." });

    } catch (error) {
        console.error('❌ Erro ao limpar e popular a base de dados:', error.message);
        if (error.sql) console.error('   SQL:', error.sql.substring(0, 200));
        return res.status(500).json({ mensagem: "Erro ao limpar a base de dados.", erro: error.message });
    }
};

controllers.getRAMUsage = async (req, res) => {
    try {
        const total = os.totalmem();
        const free = os.freemem();
        const used = total - free;

        return res.status(200).json({
            total_ram: total,
            used_ram: used,
            free_ram: free,
            total_ram_gb: (total / 1024 ** 3).toFixed(2),
            used_ram_gb: (used / 1024 ** 3).toFixed(2),
            free_ram_gb: (free / 1024 ** 3).toFixed(2),
            usage_percent: ((used / total) * 100).toFixed(2)
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            mensagem: "Erro ao obter a utilização de RAM.",
            erro: error.message
        });
    }
};

module.exports = controllers;