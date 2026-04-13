//FICHEIRO DE TESTE DE INSERÇÂO DE DADOS - REMOVER DEPOIS

const sequelize = require('./models/database');
const User = require('./models/User');

async function setup() {
  try {
    // Criar tabela (se não existir)
    await sequelize.sync({ force: true }); 
    console.log('Tabela criada!');

    // Inserir vários dados
    await User.bulkCreate([
      {
        nome: 'João Silva',
        email: 'joao@email.com',
        idade: 25
      },
      {
        nome: 'Maria Santos',
        email: 'maria@email.com',
        idade: 30
      },
      {
        nome: 'Pedro Costa',
        email: 'pedro@email.com',
        idade: 22
      }
    ]);

    console.log('Dados inseridos com sucesso!');

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await sequelize.close();
  }
}

setup();