const User = require('../models/Utilizadores.models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const controllers = {};

controllers.login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
        email: user.email_utilizador,
        role: user.tipo_utilizador
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
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
    const { nome, email, password } = req.body;

    // 🔍 verificar se já existe
    const existingUser = await User.findOne({
      where: { email_utilizador: email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email já existe' });
    }

    // 🔐 hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 👤 criar user
    const user = await User.create({
      nome_utilizador: nome,
      email_utilizador: email,
      password_utilizador: hashedPassword,
      username_utilizador: email, // ou outro valor
      tipo_utilizador: 'CO',
      imagem_utilizador: 'img3',
      estado_a_i: true
    });

    return res.status(201).json({
      message: 'Conta criada com sucesso',
      user: {
        id: user.id_utilizador,
        email: user.email_utilizador,
        role: user.tipo_utilizador
      }
    });

  } catch (error) {
    console.error(error); // 👈 importante para debug
    return res.status(500).json({ message: 'Erro no servidor', error });
  }
};

controllers.getAutenticacao = async (req, res) => {};
controllers.updateUser = async (req, res) => {};
controllers.deleteUser = async (req, res) => {};



module.exports = controllers;

