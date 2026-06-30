const Badges = require('../models/Badges.models');
const devolverEstadoBadgeService = require('../services/devolverEstadoBadge.service');
const Areas = require('../models/Areas.models');
const ServiceLines = require('../models/ServiceLines.models');
const BadgesConcluidos = require('../models/BadgesConcluidos.models');
const PedidosBadges = require('../models/PedidosBadges.models');
const Consultor = require('../models/Consultores.models')
const Sequelize = require('sequelize');
const Favoritos = require('../models/Favoritos.models');
const controller = require('./Dashboard.controller');
const firebase = require('../services/firebase.service');
const { notificarEstado } = require('../services/notificacoes.service');

const controllers = {};

function isConsultor(req) {
    return req.user?.role === "c";
}

// Mostrar todos os badges
controllers.getAllBadges = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        const whereClause = isAdmin ? {} : { estado_a_i: true };

        const resultado = await Badges.findAll({
            where: whereClause
        });

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar badges",
            erro: error.message
        });
    }
};

controllers.getFavorito = async (req, res) => {
    try {

        const idConsultor = req.user.id_consultor;

        if (!idConsultor) {
            return res.status(400).json({
                mensagem: "ID do consultor não encontrado"
            });
        }

        const favoritos = await Favoritos.findAll({
            where: {
                id_consultor: idConsultor
            },
            include: [
                {
                    model: Badges,
                    include: [
                        {
                            model: Areas,
                            attributes: ['nome_area']
                        }
                    ]
                }
            ]
        });

        const resultado = favoritos.map(f => ({
            id_badge: f.Badge.id_badge,
            nome_badge: f.Badge.nome_badge,
            descricao_badge: f.Badge.descricao_badge,
            pontos_badge: f.Badge.pontos_badge,
            nivel_badge: f.Badge.nivel_badge,
            imagem_badge: f.Badge.imagem_badge,
            nome_area: f.Badge.Area?.nome_area
        }));

        return res.status(200).json(resultado);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar favoritos",
            erro: error.message
        });
    }
};

controllers.setFavorito = async (req, res) => {
    try {
        if (!isConsultor(req)) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado",
            });
        }

        const { id_badge, set } = req.body;
        const id_consultor = req.user.id_consultor;

        if (!id_badge || set === undefined) {
            return res.status(400).json({
                mensagem: "id_badge e set são obrigatórios",
            });
        }

        const badge = await Badges.findByPk(id_badge);
        if (!badge) {
            return res.status(404).json({
                mensagem: "Badge não encontrado",
            });
        }

        if (set) {
            const favoritoExistente = await Favoritos.findOne({
                where: { id_consultor, id_badge },
            });

            if (favoritoExistente) {
                return res.status(400).json({
                    mensagem: "Badge já está nos favoritos",
                });
            }

            await Favoritos.create({ id_consultor, id_badge });
            await firebase.notificarSync('badgesFavoritos'); //tabela que esta na bd local
            return res.status(201).json({
                mensagem: "Badge adicionado aos favoritos",
            });
        } else {
            const deleted = await Favoritos.destroy({
                where: { id_consultor, id_badge },
            });

            if (!deleted) {
                return res.status(404).json({
                    mensagem: "Badge não está nos favoritos",
                });
            }

            return res.status(200).json({
                mensagem: "Badge removido dos favoritos",
            });
        }
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao atualizar favoritos",
            erro: error.message,
        });
    }
};

// Mostrar badge por ID
controllers.getBadgeById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";
        const id = req.params.id;

        const resultado = await Badges.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Badge não existe"
            });
        }

        if (resultado.estado_a_i === false && !isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao buscar badge",
            erro: error.message
        });
    }
};

// Criar badge
controllers.createBadge = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const {
            id_area,
            nome_badge,
            descricao_badge,
            pontos_badge,
            pago,
            nivel_badge,
            imagem_badge,
            sla,
            validade,
            estado_a_i
        } = req.body;

        if (!id_area) {
            return res.status(400).json({
                mensagem: "O id_area é obrigatório"
            });
        }

        if (estado_a_i !== false) {
            const area = await Areas.findByPk(id_area);
            if (!area) {
                return res.status(400).json({
                    mensagem: "A Área especificada não existe"
                });
            }
            if (area.estado_a_i === false) {
                return res.status(400).json({
                    mensagem: "Não é possível criar um Badge ativo numa Área inativa"
                });
            }
        }

        await Badges.create({
            id_area,
            nome_badge,
            descricao_badge,
            pontos_badge,
            pago,
            nivel_badge,
            imagem_badge,
            sla,
            validade,
            estado_a_i,
            data_insercao: new Date() // DATA ATUAL
        });
        await firebase.notificarSync('badges'); //tabela que esta na bd local
        return res.status(201).json({
            mensagem: "Badge criado com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao criar badge",
            erro: error.message
        });
    }
};

// Eliminar badge
controllers.deleteBadgeById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;

        const resultado = await Badges.findByPk(id);

        if (!resultado) {
            return res.status(404).json({
                mensagem: "Badge não existe"
            });
        }

        resultado.estado_a_i = false;

        await resultado.save();
        await notificarEstado(resultado.nome_badge, "Badge", false);

        await firebase.notificarSync('badges'); //tabela que esta na bd local
        return res.status(200).json({
            mensagem: "Badge eliminado com sucesso"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao eliminar badge",
            erro: error.message
        });
    }
};

// Atualizar badge
controllers.updateBadgeById = async (req, res) => {
    try {
        const isAdmin = req.user?.role === "a";

        if (!isAdmin) {
            return res.status(401).json({
                mensagem: "Utilizador não autorizado"
            });
        }

        const id = req.params.id;

        const badge = await Badges.findByPk(id);

        if (!badge) {
            return res.status(404).json({
                mensagem: "Badge não existe"
            });
        }

        const {
            id_area,
            nome_badge,
            descricao_badge,
            pontos_badge,
            pago,
            nivel_badge,
            imagem_badge,
            sla,
            validade,
            estado_a_i
        } = req.body;

        if (id_area !== undefined && id_area !== badge.id_area) {
            const area = await Areas.findByPk(id_area);
            if (!area) {
                return res.status(400).json({
                    mensagem: "A Área especificada não existe"
                });
            }
            if (area.estado_a_i === false) {
                return res.status(400).json({
                    mensagem: "Não é possível associar a uma Área inativa"
                });
            }
        }

        badge.id_area = id_area ?? badge.id_area;
        badge.nome_badge = nome_badge ?? badge.nome_badge;
        badge.descricao_badge = descricao_badge ?? badge.descricao_badge;
        badge.pontos_badge = pontos_badge ?? badge.pontos_badge;
        badge.pago = pago ?? badge.pago;
        badge.nivel_badge = nivel_badge ?? badge.nivel_badge;
        badge.imagem_badge = imagem_badge ?? badge.imagem_badge;
        badge.sla = sla ?? badge.sla;
        badge.validade = validade ?? badge.validade;
        badge.estado_a_i = estado_a_i ?? badge.estado_a_i;

        badge.data_insercao = new Date(); // DATA ATUALIZADA

        await badge.save();

        if (estado_a_i !== undefined && estado_a_i !== badge.estado_a_i) {
            await notificarEstado(badge.nome_badge, "Badge", estado_a_i);
        }
        
        await firebase.notificarSync('badges'); //tabela que esta na bd local
        return res.status(200).json({
            mensagem: "Badge atualizado com sucesso",
            dados: badge
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            mensagem: "Erro ao atualizar badge",
            erro: error.message
        });
    }
};

// Devolver estado do badge
controllers.devolverEstadoBadge = async (req, res) => {
    try {
        const estado = await devolverEstadoBadgeService.devolverEstadoBadge(
            req.params.id_badge,
            req.params.id_consultor
        );
        res.json({ estado });
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

controllers.devolverEstadoBadgeMobile = async (req, res) => {
    try {
        const estado = await devolverEstadoBadgeService.devolverEstadoBadge(
            req.params.id_badge,
            req.params.id_consultor
        );
        res.json(estado);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

controllers.getAllBadgesMobile = async (req, res) => {
    try {
        const response = await Badges.findAll({
            where: { estado_a_i: true },
            include: [
                {
                    model: Areas,
                    attributes: ['nome_area']
                }
            ]
        });

        const dados = response.map(item => ({
            ID_BADGE: item.id_badge,
            ID_AREA: item.id_area,
            NOME_BADGE: item.nome_badge,
            DESCRICAO_BADGE: item.descricao_badge,
            PONTOS_BADGE: item.pontos_badge,
            PAGO: item.pago,
            NIVEL_BADGE: item.nivel_badge,
            IMAGEM_BADGE: item.imagem_badge,
            nome_area_pai: item.Area?.nome_area || "Sem Área",
            ESTADO_A_I_: item.estado_a_i,
            DATA_INSERCAO: item.data_insercao
        }));

        res.json(dados);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

controllers.getBadgesByAreaIDMobile = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send("ERRO! Tens de enviar o Id da Area");
    }

    try {

        const response = await Badges.findAll({
            where: { id_area: id },
            include: [
                {
                    model: Areas,
                    attributes: [
                        'nome_area'
                    ]
                }
            ]
        });

        const dados = response.map(item => ({
            ID_BADGE: item.id_badge,
            ID_AREA: item.id_area,
            NOME_BADGE: item.nome_badge,
            DESCRICAO_BADGE: item.descricao_badge,
            PONTOS_BADGE: item.pontos_badge,
            PAGO: item.pago,
            NIVEL_BADGE: item.nivel_badge,
            IMAGEM_BADGE: item.imagem_badge,
            nome_area_pai: item.Area.nome_area,
            ESTADO_A_I_: item.estado_a_i,
            DATA_INSERCAO: item.data_insercao
        }));

        res.json(dados);


    } catch (err) {
        return res.status(500).json({ error: err.message });
    }

}

controllers.getBadgeByIdMobile = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send("Tens de enviar o id do badge no url");
    }

    const response = await Badges.findOne({
        where: { id_badge: id },
        include: [
            {
                model: Areas,
                attributes: [
                    'nome_area'
                ]
            }
        ]
    });


    const dados = {
        ID_BADGE: response.id_badge,
        ID_AREA: response.id_area,
        NOME_BADGE: response.nome_badge,
        DESCRICAO_BADGE: response.descricao_badge,
        PONTOS_BADGE: response.pontos_badge,
        PAGO: response.pago,
        NIVEL_BADGE: response.nivel_badge,
        IMAGEM_BADGE: response.imagem_badge,
        nome_area_pai: response.Area.nome_area,
        ESTADO_A_I_: response.estado_a_i,
        DATA_INSERCAO: response.data_insercao
    };

    res.json([dados]);

}

//BADGES CONCLUIDOS MOBILE
//BADGES CONCLUIDOS MOBILE
controllers.getBadgesObtidosConsultorMobile = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID do consultor é obrigatório" });
        }

        // Usamos BadgesConcluidos como base para garantir que trazemos tudo o que existe na tabela
        const conquistas = await BadgesConcluidos.findAll({
            where: { id_consultor: id },
            include: [
                {
                    model: Badges,
                    include: [
                        {
                            model: Areas,
                            include: [ServiceLines]
                        }
                    ]
                }
            ]
        });

        if (!conquistas || conquistas.length === 0) {
            return res.json([]);
        }

        // Formatação exata para o factory BadgesConcluidosModel.fromJson do Dart
        const resultado = conquistas.map(c => {
            const b = c.Badge;
            const area = b?.Area;
            const sl = area?.ServiceLine;

            return {
                ID_BADGE_CONCLUIDO: c.id_badge_concluido,
                ID_BADGE: b?.id_badge,
                NOME_BADGE: b?.nome_badge || "Sem Nome",
                nome_area_pai: area?.nome_area || "Sem Área", // Lowercase como no Dart
                NIVEL_BADGE: b?.nivel_badge || "",
                PONTOS_BADGE: b?.pontos_badge || 0, // Adicionado (faltava)
                IMAGEM_BADGE: b?.imagem_badge || "",
                nome_sl_pai: sl?.nome_service_line || "N/A", // Lowercase como no Dart
                DATA_CONCLUSAO: c.data_conclusao_badge,
                VALIDADE: b?.validade // Adicionado para o cálculo da expiração no Dart
            };
        });

        res.json(resultado);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao procurar Badges concluidos do consultor", details: err.message });
    }
};

controllers.getBadgesRecomendados = async (req, res) => {
    try {

        const idConsultor = req.user.id_consultor;

        // Buscar consultor para obter a área
        const consultor = await Consultor.findByPk(idConsultor);
        if (!consultor) {
            return res.status(404).json({ mensagem: "Consultor não encontrado" });
        }

        // Buscar IDs dos badges já concluídos pelo consultor
        const concluidos = await BadgesConcluidos.findAll({
            where: { id_consultor: idConsultor },
            attributes: ["id_badge"],
        });
        const idsConcluidos = concluidos.map((b) => b.id_badge);

        // Badges recomendados: da área do consultor e não concluídos
        const recomendados = await Badges.findAll({
            where: {
                id_area: consultor.id_area,
                estado_a_i: true,
                ...(idsConcluidos.length > 0 && {
                    id_badge: { [Sequelize.Op.notIn]: idsConcluidos },
                }),
            },
        });
        const idsRecomendados = recomendados.map((b) => b.id_badge);

        // Restantes: não concluídos e não recomendados
        const excluir = [...idsConcluidos, ...idsRecomendados];
        const restantes = await Badges.findAll({
            where: {
                estado_a_i: true,
                ...(excluir.length > 0 && {
                    id_badge: { [Sequelize.Op.notIn]: excluir },
                }),
            },
        });

        return res.status(200).json({ recomendados, restantes });
    } catch (error) {
        return res.status(500).json({
            mensagem: "Erro ao buscar badges recomendados",
            erro: error.message,
        });
    }
};

controllers.badgesEmAnalize = async (req, res) => {
    try {
        if (req.user.role !== 'c') {
            return res.status(403).json({ message: 'Acesso negado. Apenas consultores podem aceder a este recurso.' });
        }

        const id_consultor = req.user.id_consultor;

        if (!id_consultor) {
            return res.status(404).json({ message: 'Consultor não encontrado.' });
        }

        const badgesEmAndamento = await PedidosBadges.findAll({
            where: {
                id_consultor,
                estado_atual: { [Sequelize.Op.notIn]: [3, 4, 5, 6] }
            },
            include: [
                {
                    model: Badges,
                    include: [
                        {
                            model: Areas,
                            attributes: ['nome_area']
                        }
                    ]
                }
            ]
        });

        return res.status(200).json(badgesEmAndamento);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao procurar badges em andamento.', error });
    }
}

controllers.badgesObtidos = async (req, res) => {
    try {
        if (req.user.role !== 'c') {
            return res.status(403).json({ mensagem: 'Acesso negado. Apenas consultores podem aceder a este recurso.' });
        }

        const id_consultor = req.user.id_consultor;

        if (!id_consultor) {
            return res.status(404).json({ mensagem: 'Consultor não encontrado.' });
        }

        const badgesObtidos = await BadgesConcluidos.findAll({
            where: { id_consultor },
            include: [
                { model: Badges }
            ]
        });

        return res.status(200).json(badgesObtidos);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao procurar badges obtidos.', erro: error.message });
    }
}

controllers.porObter = async (req, res) => {
    try {
        if (req.user.role !== 'c') {
            return res.status(403).json({ mensagem: 'Acesso negado. Apenas consultores podem aceder a este recurso.' });
        }

        const id_consultor = req.user.id_consultor;
        if (!id_consultor) {
            return res.status(404).json({ mensagem: 'Consultor não encontrado.' });
        }

        // IDs de badges já obtidos
        const badgesObtidos = await BadgesConcluidos.findAll({
            where: { id_consultor },
            attributes: ['id_badge']
        });

        // IDs de badges com pedido ativo
        const pedidosAtivos = await PedidosBadges.findAll({
            where: { id_consultor },
            attributes: ['id_badge']
        });

        const idsAExcluir = [
            ...new Set([
                ...badgesObtidos.map(b => b.id_badge),
                ...pedidosAtivos.map(p => p.id_badge)
            ])
        ];

        const badgesPorObter = await Badges.findAll({
            where: {
                estado_a_i: true,
                ...(idsAExcluir.length > 0 && {
                    id_badge: { [Sequelize.Op.notIn]: idsAExcluir }
                })
            }
        });

        return res.status(200).json(badgesPorObter);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao procurar badges por obter.', erro: error.message });
    }
};

controllers.expirados = async (req, res) => {
    try {
        if (req.user.role !== 'c') {
            return res.status(403).json({ mensagem: 'Acesso negado. Apenas consultores podem aceder a este recurso.' });
        }

        const id_consultor = req.user.id_consultor;
        if (!id_consultor) {
            return res.status(404).json({ mensagem: 'Consultor não encontrado.' });
        }

        const pedidosAtivos = await PedidosBadges.findAll({
            where: {
                id_consultor,
                estado_atual: { [Sequelize.Op.notIn]: [4, 5] }
            },
            include: [{ model: Badges }]
        });

        const agora = new Date();

        const badgesExpirados = pedidosAtivos
            .filter(pedido => {
                const diasDesdeCriacao = Math.floor((agora - new Date(pedido.createdAt)) / (1000 * 60 * 60 * 24));
                return diasDesdeCriacao >= pedido.Badge.sla;
            })
            .map(pedido => pedido.Badge);

        return res.status(200).json(badgesExpirados);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao procurar badges expirados.', erro: error.message });
    }
};

controllers.devolvidos = async (req, res) => {
    try {
        if (req.user.role !== 'c') {
            return res.status(403).json({ mensagem: 'Acesso negado. Apenas consultores podem aceder a este recurso.' });
        }

        const id_consultor = req.user.id_consultor;
        if (!id_consultor) {
            return res.status(404).json({ mensagem: 'Consultor não encontrado.' });
        }

        const pedidosDevolvidos = await PedidosBadges.findAll({
            where: {
                id_consultor,
                estado_atual: { [Sequelize.Op.in]: [3, 6] }
            },
            include: [{ model: Badges }]
        });

        const badges = pedidosDevolvidos.map(pedido => pedido.Badge);

        return res.status(200).json(badges);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: 'Erro ao procurar badges devolvidos.', erro: error.message });
    }
};

controllers.getBadgeShareHtml = async (req, res) => {
    try {
        const id = req.params.id;

        const badge = await Badges.findByPk(id, {
            include: [
                {
                    model: Areas,
                    attributes: ['nome_area']
                }
            ]
        });

        if (!badge) {
            return res.status(404).send('Badge não encontrado');
        }

        // URL base do site
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const badgeUrl = `${baseUrl}/badges/${badge.id_badge}`;

        // imagem absoluta (IMPORTANTE para LinkedIn)
        const imageUrl = badge.imagem_badge?.startsWith('http')
            ? badge.imagem_badge
            : `${baseUrl}/${badge.imagem_badge}`;

        const title = `${badge.nome_badge} | Softinsa`;
        const description = badge.descricao_badge
            ? badge.descricao_badge
            : `Conquista o badge ${badge.nome_badge} na Softinsa`;

        const html = `
        <!DOCTYPE html>
        <html lang="pt">
        <head>
            <meta charset="utf-8">

            <!-- Open Graph (LinkedIn usa isto) -->
            <meta property="og:type" content="website" />
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${description}" />
            <meta property="og:image" content="${imageUrl}" />
            <meta property="og:url" content="${badgeUrl}" />

            <!-- fallback -->
            <meta name="description" content="${description}" />

            <title>${title}</title>
        </head>
        <body>
            <p>Redirecionando para o badge...</p>
            <script>
                window.location.href = "${badgeUrl}";
            </script>
        </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);

    } catch (error) {
        console.error(error);
        return res.status(500).send('Erro ao gerar página de partilha');
    }
};


module.exports = controllers;