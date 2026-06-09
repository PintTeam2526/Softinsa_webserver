import api from '../services/api'


export const registarConsultor = async (_nome,_email,_username,_password,_fotoPerfil,_idAreaPref ) => {
  try {
    const dadosRegisto = {
      nome: _nome,
      email: _email,
      username: _username,
      password: _password,
      fotoPerfil: _fotoPerfil,
      idAreaPref: _idAreaPref
    }
    
    await api.post('/autenticacao/register', dadosRegisto);
    console.log('Registo efetuado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao registar o consultor!', error);
    return false;
  }
}