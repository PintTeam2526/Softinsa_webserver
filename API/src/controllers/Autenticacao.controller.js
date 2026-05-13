const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('../../database');

const User = require('../models/Utilizadores.models');
const Consultor = require('../models/Consultores.models');
const TalentManager = require('../models/TalentManagers.models');
const ServiceLineLider = require('../models/ServiceLineLiders.models');
const Administrador = require('../models/Administradores.models');

const controllers = {};

controllers.login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // Procurar utilizador
    const user = await User.findOne({
      where: {
        email_utilizador: email
      }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Utilizador não encontrado'
      });
    }

    // Validar password
    const isMatch = await bcrypt.compare(
      password,
      user.password_utilizador
    );

    if (!isMatch) {
      return res.status(400).json({
        message: 'Password incorreta'
      });
    }

    // Payload base
    const payload = {
      id: user.id_utilizador,
      email: user.email_utilizador,
      role: user.tipo_utilizador
    };

    /* ========================================= */
    /* CONSULTOR                                 */
    /* ========================================= */

    if (user.tipo_utilizador === 'CO') {

      const consultor = await Consultor.findOne({
        where: {
          id_utilizador: user.id_utilizador
        }
      });

      payload.id_consultor = consultor?.id_consultor || null;
    }

    /* ========================================= */
    /* TALENT MANAGER                            */
    /* ========================================= */

    if (user.tipo_utilizador === 'TM') {

      const talentManager = await TalentManager.findOne({
        where: {
          id_utilizador: user.id_utilizador
        }
      });

      payload.id_talent_manager =
        talentManager?.id_talent_manager || null;
    }

    /* ========================================= */
    /* SERVICE LINE LIDER                        */
    /* ========================================= */

    if (user.tipo_utilizador === 'SL') {

      const serviceLine = await ServiceLineLider.findOne({
        where: {
          id_utilizador: user.id_utilizador
        }
      });

      payload.id_service_line_lider =
        serviceLine?.id_service_line_lider || null;
    }

    /* ========================================= */
    /* ADMINISTRADOR                             */
    /* ========================================= */

    if (user.tipo_utilizador === 'AD') {

      const admin = await Administrador.findOne({
        where: {
          id_utilizador: user.id_utilizador
        }
      });

      payload.id_admin =
        admin?.id_administrador || null;
    }

    // Criar token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: '1d'
      }
    );

    // Resposta
    return res.status(200).json({
      token,
      user: payload
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: 'Erro no servidor',
      error: error.message
    });
  }
};

controllers.register = async (req, res) => {

  const transaction = await sequelize.transaction();

  try {

    const {
      nome,
      email,
      password
    } = req.body;

    // Verificar email
    const existingUser = await User.findOne({
      where: {
        email_utilizador: email
      }
    });

    if (existingUser) {

      await transaction.rollback();

      return res.status(400).json({
        message: 'Email já existe'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    /* ========================================= */
    /* CRIAR UTILIZADOR                          */
    /* ========================================= */

    const user = await User.create({
      nome_utilizador: nome,
      email_utilizador: email,
      password_utilizador: hashedPassword,
      username_utilizador: email,
      tipo_utilizador: 'CO',
      imagem_utilizador: 'img3',
      estado_a_i: true
    }, {
      transaction
    });

    /* ========================================= */
    /* CRIAR CONSULTOR                           */
    /* ========================================= */

    const consultor = await Consultor.create({
      id_utilizador: user.id_utilizador,

      // Ajusta conforme o teu schema
      total_pontos: 0,

      // ID da área default
      id_area: 1,

      nome_utilizador: nome,
      email_utilizador: email,
      password_utilizador: hashedPassword,
      username_utilizador: email,
      tipo_utilizador: 'CO',
      estado_a_i: true

    }, {
      transaction
    });

    // Confirmar transaction
    await transaction.commit();

    return res.status(201).json({
      message: 'Conta criada com sucesso',

      user: {
        id: user.id_utilizador,
        email: user.email_utilizador,
        role: user.tipo_utilizador
      },

      consultor: {
        id_consultor: consultor.id_consultor
      }
    });

  } catch (error) {

    await transaction.rollback();

    console.error(error);

    return res.status(500).json({
      message: 'Erro no servidor',
      error: error.message
    });
  }
};

controllers.getAutenticacao = async (req, res) => { };
controllers.updateUser = async (req, res) => { };
controllers.deleteUser = async (req, res) => { };



module.exports = controllers;

