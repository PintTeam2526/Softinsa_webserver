const { Op } = require('sequelize');
const User = require('../models/Utilizadores.models');
const Consultor = require('../models/Consultores.models');
const Administradores = require('../models/Administradores.models');
const TalentManagers = require('../models/TalentManagers.models');
const ServiceLineLiders = require('../models/ServiceLineLiders.models');
const Area = require('../models/Areas.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Utilizadores = require('../models/Utilizadores.models')


const controllers = {};

controllers.loginMobile = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Tens de enviar o email e a password no body' });
    }

    // 1. Procura primeiro o utilizador (Sem include para não dar erro)
    const user = await User.findOne({
      where: { email_utilizador: email, tipo_utilizador: 'c' }
    });

    if (!user) {
      return res.status(400).json({ message: 'Consultor não encontrado' });
    }

    // 2. Agora que temos o user, procuramos o Consultor manualmente usando o id_utilizador
    const consultorData = await Consultor.findOne({
      where: { id_utilizador: user.id_utilizador }
    });

    // Capturamos o ID se ele existir
    const idConsultor = consultorData ? consultorData.id_consultor : null;

    // 3. Verificar password
    const isMatch = await bcrypt.compare(password, user.password_utilizador);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password incorreta' });
    }

    // 4. Criar token 
    const token = jwt.sign(
      {
        id: user.id_utilizador,
        id_consultor: idConsultor,
        email: user.email_utilizador,
        role: user.tipo_utilizador
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 5. Resposta com o id_consultor
    return res.status(200).json({
      token,
      user: {
        id_utilizador: user.id_utilizador,
        id_consultor: idConsultor,
        role: user.tipo_utilizador
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no servidor', error });
  }
};


controllers.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Tens de enviar o email e a password no body' });
    }

    const user = await User.findOne({
      where: { email_utilizador: email }
    });

    if (!user) {
      return res.status(400).json({ message: 'Utilizador não encontrado' });
    }

    const isMatch = await bcrypt.compare(password, user.password_utilizador);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password incorreta' });
    }

    const role = user.tipo_utilizador;
    let rolePayload = {};

    if (/^a$/i.test(role)) {
      const r = await Administradores.findOne({ where: { id_utilizador: user.id_utilizador } });
      if (r) rolePayload.id_administrador = r.id_administrador;
    } else if (/^t$/i.test(role)) {
      const r = await TalentManagers.findOne({ where: { id_utilizador: user.id_utilizador } });
      if (r) rolePayload.id_talent_manager = r.id_talent_manager;
    } else if (/^s$/i.test(role)) {
      const r = await ServiceLineLiders.findOne({ where: { id_utilizador: user.id_utilizador } });
      if (r) rolePayload.id_service_line_lider = r.id_service_line_lider;
    } else if (/^c$/i.test(role)) {
      const r = await Consultor.findOne({ where: { id_utilizador: user.id_utilizador } });
      if (r) rolePayload.id_consultor = r.id_consultor;
    }

    const token = jwt.sign(
      { id: user.id_utilizador, email: user.email_utilizador, role, ...rolePayload },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      user: { email: user.email_utilizador, role, ...rolePayload }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Erro no servidor', error });
  }
};

controllers.register = async (req, res) => {
  try {

    const { nome, email, username, password, fotoPerfil, idAreaPref } = req.body;

    if (!nome || !email || !password || !fotoPerfil || !idAreaPref || !username) {
      return res.status(400).json({ message: 'Faltam atributos no body deste post' });
    }

    // verificar se já existe (garante que nao deixa criar um email ou username que ja exista)
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email_utilizador: email },
          { username_utilizador: username }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email ou username já existe' });
    }

    // verificar se a área de preferência existe
    const areaExists = await Area.findByPk(idAreaPref);
    if (!areaExists) {
      return res.status(400).json({ message: 'Área de preferência não existe' });
    }

    // hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // criar user
    const user = await User.create({
      nome_utilizador: nome,
      email_utilizador: email,
      password_utilizador: hashedPassword,
      username_utilizador: username,
      tipo_utilizador: 'c',
      imagem_utilizador: fotoPerfil,
      estado_a_i: true
    });

    //capturar o id do user criado
    const idUser = user.id_utilizador;

    // criar o consultor
    const consultor = await Consultor.create({
      id_utilizador: idUser,
      total_pontos: 0, //começa sempre com 0 total_pontos
      id_area: idAreaPref
    })

    //criar as conquistas do consultor
    //const conquistas = await Conquistas.findAll();

    //conquistas.forEach(conquista => {
    // conquistasService.criarConquista(consultor.id_consultor, conquista.id_conquista);
    // });

    return res.status(201).json({
      message: 'Conta criada com sucesso',
      user: {
        id: user.id_utilizador,
        email: user.email_utilizador,
        role: user.tipo_utilizador
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no servidor', error });
  }
};


controllers.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilizador não encontrado' });
    }

    user.estado_a_i = false;
    await user.save();

    return res.status(200).json({ message: 'Conta eliminada com sucesso' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro no servidor', error });
  }
};

controllers.updatePerfil = async (req, res) => {
    try {
        const { email, password, password_antiga, foto, id_area } = req.body;
        const role = req.user.role;

        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({ mensagem: "Utilizador não encontrado." });
        }

        if (email) user.email_utilizador = email;
        if (foto) user.imagem_utilizador = foto;

        if (password) {
            if (!password_antiga) {
                return res.status(400).json({ mensagem: "É obrigatório enviar a password antiga para alterar a password." });
            }

            const passwordCorreta = await bcrypt.compare(password_antiga, user.password_utilizador);
            if (!passwordCorreta) {
                return res.status(400).json({ mensagem: "Password antiga incorreta." });
            }

            user.password_utilizador = await bcrypt.hash(password, 10);
        }

        await user.save();

        if (role === 'c' && id_area) {
            const areaExiste = await Area.findByPk(id_area);
            if (!areaExiste) {
                return res.status(404).json({ mensagem: "Área não encontrada." });
            }

            const consultor = await Consultor.findOne({
                where: { id_utilizador: req.user.id }
            });

            if (!consultor) {
                return res.status(404).json({ mensagem: "Consultor não encontrado." });
            }

            consultor.id_area = id_area;
            await consultor.save();
        }

        return res.status(200).json({ mensagem: "Perfil atualizado com sucesso." });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao atualizar perfil.", erro: error.message });
    }
};



module.exports = controllers;

