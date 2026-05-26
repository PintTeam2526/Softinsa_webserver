const admin = require('firebase-admin');
const serviceAccount = require('../../config/pint26-softinsa-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firebaseService = {};

// Função para avisar o mobile que deve sincronizar uma tabela específica
firebaseService.notificarSync = async (tabelaAlterada) => {
  const message = {
    data: {
      type: 'SYNC_TABLE',
      table: tabelaAlterada //a variavel de entrada tem de ter o mesmo nome que a tabela bdLocal do mobile
    },
    topic: 'atualizacao_mobile' // O tópico que o Flutter subscreveu
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Mensagem de sync enviada:', response);
  } catch (error) {
    console.error('Erro ao enviar mensagem Firebase:', error);
  }
};

module.exports = firebaseService;
