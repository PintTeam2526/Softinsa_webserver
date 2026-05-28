const { Op } = require('sequelize');
const Administradores = require('../models/Administradores.models');
const Utilizadores = require('../models/Utilizadores.models');
const Consultores = require('../models/Consultores.models');
const Badges = require('../models/Badges.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const Areas = require('../models/Areas.models');
const ServiceLines = require('../models/ServiceLines.models');
const LearningPaths = require('../models/LearningPaths.models');

const service = {};

//obter nome do administrador
service.getNomeAdministrador = async (id_administrador) => {
    const administrador = await Administradores.findByPk(id_administrador);
    const utilizador = await Utilizadores.findByPk(administrador.id_utilizador);
    return utilizador.nome_utilizador;
};

//obter o total de utilizadores
service.getTotalUtilizadores =async () => {
    return await Utilizadores.count();
};

//obter o total de badges
service.getTotalBadges = async () => {
    return await Badges.count();
};

//obter o total de áreas
service.getTotalAreas = async () => {
    return await Areas.count();
};

//obter o total de service lines
service.getTotalServiceLines = async () => {
    return await ServiceLines.count();
};

//obter o total de learning pahts
service.getTotaltotalLearningPaths = async () => {
    return await LearningPaths.count();
};

//obter número de badges obtidos por ano, por mês e por learning path
service.getNumeroBadgesObtidosMesAno = async (ano, mesInicial, mesFinal) => {

    // buscar learning paths
    const learningPaths = await LearningPaths.findAll({
        order: [['id_learning_path', 'ASC']]
    });
    const resultado = [];

    // percorrer meses
    for (var mes = mesInicial; mes <= mesFinal; mes++) {
        const dataInicio = new Date(ano, mes - 1, 1);
        const dataFim = new Date(ano, mes, 0, 23, 59, 59);
        const dadosMes = {mes};

        // percorrer learning paths
        for (const learningPath of learningPaths) {
            const total = await BadgesConcluidos.count({
                where: {
                    data_conclusao_badge: {[Op.between]: [dataInicio, dataFim]}
                },
                include: [{
                    model: Badges,
                    include: [{
                        model: Areas,
                        include: [{
                            model: ServiceLines,
                                where: {id_learning_path: learningPath.id_learning_path}
                        }]
                    }]
                }]
            });

            dadosMes[learningPath.nome_learning_path] = total;
        }
        resultado.push(dadosMes);
    }
    return resultado;
};

//obter percentagem de badges obtidos por learning path e por nível
service.getPercentagemBadgesObtidosNivel = async (nivel) => {

    // buscar learning paths
    const learningPaths = await LearningPaths.findAll({
        order: [['id_learning_path', 'ASC']]
    });
    const resultado = {};

    // percorrer learning paths
    for (const learningPath of learningPaths) {

        //service lines da learning path
        const serviceLines = await ServiceLines.findAll({
            where: {
                id_learning_path: learningPath.id_learning_path
            }
        });
        const idsServiceLines = serviceLines.map(sl => sl.id_service_line);

        //áreas da learning path
        const areas = await Areas.findAll({
            where: {
                id_service_line: {[Op.in]: idsServiceLines}
            }
        });
        const idsAreas = areas.map(area => area.id_area);

        const consultores = await Consultores.findAll({
            where: {
                id_area: {[Op.in]: idsAreas},
            }
        });
        const idsConsultores = consultores.map(c => c.id_consultor);
        const totalConsultores = idsConsultores.length;

        //badges da learning path
        const badges = await Badges.findAll({
            where: {
                id_area: {[Op.in]: idsAreas},
                nivel_badge: nivel
            }
        });
        const idsBadges = badges.map(badge => badge.id_badge);
        const totalBadges = idsBadges.length;

        //total possível
        const totalPossivel = totalConsultores * totalBadges;

        // evitar divisão por zero
        if (totalPossivel === 0) {
            resultado[learningPath.nome_learning_path] = 0;
            continue;
        }

        //badges concluídos
        const totalObtidos = await BadgesConcluidos.count({
            where: {
                id_consultor: {[Op.in]: idsConsultores},
                id_badge: {[Op.in]: idsBadges}
            }
        });

        //calcular percentagem com duas casas decimais
        const percentagem = (totalObtidos / totalPossivel) * 100;
        resultado[learningPath.nome_learning_path] = Number(percentagem.toFixed(2));
    }

    return resultado;
};

//obter percentagem de badges obtidos por ano, por mês e por learning path até aquele momento
service.getPercentagemBadgesObtidosMesAno = async (ano) => {
    // buscar learning paths
    const learningPaths = await LearningPaths.findAll({
        order: [['id_learning_path', 'ASC']]
    });
    const resultado = [];

    // percorrer meses
    for (var mes = 1; mes <= 12; mes++) {
        // último dia do mês
        const dataFim = new Date(ano, mes, 0, 23, 59, 59);
        const dadosMes = {mes};

        // percorrer learning paths
        for (const learningPath of learningPaths) {
            const serviceLines = await ServiceLines.findAll({
                where: {id_learning_path: learningPath.id_learning_path}
            });

            const idsServiceLines = serviceLines.map(sl => sl.id_service_line);
            const areas = await Areas.findAll({
                where: {
                    id_service_line: {[Op.in]: idsServiceLines}
                }
            });
            const idsAreas = areas.map(area => area.id_area);
            const badges = await Badges.findAll({
                 where: {
                    id_area: {[Op.in]: idsAreas}
                }
            });
            const idsBadges = badges.map(badge => badge.id_badge);
            const totalBadgesLP = idsBadges.length;

            const consultores = await Consultores.findAll({
                where: {
                    id_area: {[Op.in]: idsAreas}
                }
            })
            const idsConsultores = consultores.map(c => c.id_consultor);
            const totalConsultoresLP = idsConsultores.length;

            const totalPossivelLP = totalBadgesLP * totalConsultoresLP;

            // evitar divisão por zero
            if (totalPossivelLP === 0) {
                dadosMes[learningPath.nome_learning_path] = 0;
                continue;
            }

            //badges obtidos até ao mês
            const totalObtidos = await BadgesConcluidos.count({
                where: {
                    id_badge: {[Op.in]: idsBadges},
                    id_consultor: {[Op.in]: idsConsultores},
                    data_conclusao_badge: {[Op.lte]: dataFim}
                }
            });

            //percentagem
            const percentagem = (totalObtidos / totalPossivelLP) * 100;
            dadosMes[learningPath.nome_learning_path] = Number(percentagem.toFixed(2));
        }
        resultado.push(dadosMes);
    }

    return resultado;
};


module.exports = service;