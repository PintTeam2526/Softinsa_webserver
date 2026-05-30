// Guarda os códigos em memória: { email: { codigo, expira } }
const codigos = {};

function guardarCodigo(email, codigo) {
    codigos[email] = {
        codigo,
        expira: Date.now() + 15 * 60 * 1000  // 15 minutos
    };
}

function validarCodigo(email, codigo) {
    const entrada = codigos[email];

    if (!entrada) return { valido: false, mensagem: "Código não encontrado." };
    if (Date.now() > entrada.expira) {
        delete codigos[email];
        return { valido: false, mensagem: "Código expirado." };
    }
    if (entrada.codigo !== codigo) return { valido: false, mensagem: "Código incorreto." };

    return { valido: true };
}

function removerCodigo(email) {
    delete codigos[email];
}

module.exports = { guardarCodigo, validarCodigo, removerCodigo };