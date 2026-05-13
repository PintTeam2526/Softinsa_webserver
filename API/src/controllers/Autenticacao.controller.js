const { Op } = require('sequelize'); //para poder usar o or
const User = require('../models/Utilizadores.models');
const Consultor = require('../models/Consultores.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const controllers = {};

controllers.loginMobile = async (req, res) => {
  try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Tens de enviar o email e a password no body'});
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

    if (!email || !password)
    {
      return res.status(400).json({ message: 'Tens de enviar o email e a password no body'});
    }
    
    // Procurar utilizador na BD
    const user = await User.findOne({
      where: { email_utilizador: email }
    });


    if (!user) {
      return res.status(400).json({ message: 'Utilizador não encontrado' });
    }

    // Verificar password
    const isMatch = await bcrypt.compare(password, user.password_utilizador);

    if (!isMatch) {
      return res.status(400).json({ message: 'Password incorreta' });
    }

    // Criar token
    const token = jwt.sign(
      {
        id: user.id_utilizador,
        email: user.email_utilizador,
        role: user.tipo_utilizador
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Resposta
    return res.status(200).json({
      token,
      user: {
        email: user.email_utilizador,
        role: user.tipo_utilizador
      }
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

    // hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // criar user
    const user = await User.create({
      nome_utilizador: nome,
      email_utilizador: email,
      password_utilizador: hashedPassword,
      username_utilizador: email,
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

controllers.getAutenticacao = async (req, res) => { };
controllers.updateUser = async (req, res) => { };
controllers.deleteUser = async (req, res) => { };



module.exports = controllers;

