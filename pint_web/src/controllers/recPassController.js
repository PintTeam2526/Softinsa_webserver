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

// Enviar o código de 6 dígitos para o email
export const enviarCodigoRecuperacao = async (_email) => {
  try {
    await api.post('/autenticacao/recuperar-password/enviar-codigo', {
      email: _email
    });
    console.log('Código de recuperação enviado!');
    return true;
  } catch (error) {
    console.error('Erro ao enviar código de recuperação!', error);
    return false;
  }
}

// Verificar se o código introduzido é válido
export const verificarCodigoRecuperacao = async (_email, _codigo) => {
  try {
    await api.post('/autenticacao/recuperar-password/verificar-codigo', {
      email: _email,
      codigo: _codigo
    });
    console.log('Código válido!');
    return true;
  } catch (error) {
    console.error('Código inválido ou expirado!', error);
    return false;
  }
}

// Redefinir a password com o código validado
export const redefinirPassword = async (_email, _codigo, _novaPassword) => {
  try {
    await api.put('/autenticacao/recuperar-password/redefinir', {
      email: _email,
      codigo: _codigo,
      nova_password: _novaPassword
    });
    console.log('Password redefinida com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao redefinir a password!', error);
    return false;
  }
}
