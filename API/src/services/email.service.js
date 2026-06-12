const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function enviarCodigoRecuperacao(email, codigo) {
    await transporter.sendMail({
        from: `"Softinsa Badges" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recuperação de Password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                <h2 style="color: #0033A0;">Recuperação de Password</h2>
                <p>Recebemos um pedido para redefinir a password da tua conta.</p>
                <p>Usa o seguinte código para continuar. O código é válido por <strong>15 minutos</strong>.</p>
                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                    <h1 style="color: #0033A0; letter-spacing: 8px;">${codigo}</h1>
                </div>
                <p>Se não pediste a recuperação de password, ignora este email.</p>
            </div>
        `
    });
}

async function enviarEmailBoasVindas(email, nome) {
    await transporter.sendMail({
        from: `"Softinsa Badges" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Bem-vindo à Softinsa Badges',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
                <h2 style="color: #0033A0;">Bem-vindo à Softinsa Badges!</h2>
                <p>Olá <strong>${nome}</strong>,</p>
                <p>A tua conta foi criada com sucesso.</p>
                <p>Já podes iniciar sessão e começar a utilizar a plataforma.</p>
                <div style="background-color:#f4f4f4;padding:15px;border-radius:8px;margin:20px 0;">
                    <p><strong>Email:</strong> ${email}</p>
                </div>
                <p>Obrigado por te juntares a nós.</p>
                <p>Equipa Softinsa Badges</p>
            </div>
        `
    });
}

async function enviarEmailNovoPedidoTM(emailTM, nomeTM, nomeConsultor, nomeBadge) {
    await transporter.sendMail({
        from: `"Softinsa Badges" <${process.env.EMAIL_USER}>`,
        to: emailTM,
        subject: 'Nova candidatura para validação',
        html: `
            <h2>Nova candidatura submetida</h2>
            <p>Olá ${nomeTM},</p>
            <p>Foi submetida uma nova candidatura que necessita da tua validação.</p>
            <ul>
                <li><strong>Consultor:</strong> ${nomeConsultor}</li>
                <li><strong>Badge:</strong> ${nomeBadge}</li>
            </ul>
            <p>Acede à plataforma para analisar o pedido.</p>
        `
    });
}

async function enviarEmailPedidoSubmetido(email, nome, nomeBadge) {
    await transporter.sendMail({
        from: `"Softinsa Badges" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Candidatura submetida com sucesso',
        html: `
            <h2>Candidatura submetida</h2>
            <p>Olá ${nome},</p>
            <p>A tua candidatura ao badge foi submetida com sucesso.</p>
            <ul>
                <li><strong>Badge:</strong> ${nomeBadge}</li>
            </ul>
            <p>Receberás uma notificação quando existir uma decisão.</p>
        `
    });
}

async function enviarEmailPedidoDevolvido(email, nome, nomeBadge, motivo) {
    await transporter.sendMail({
        from: `"Softinsa Badges" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Pedido devolvido para correção',
        html: `
            <h2>Pedido devolvido</h2>
            <p>Olá ${nome},</p>
            <p>O teu pedido para o badge <strong>${nomeBadge}</strong> foi devolvido.</p>
            <p><strong>Motivo:</strong></p>
            <div style="background:#f4f4f4;padding:15px;border-radius:5px;">
                ${motivo}
            </div>
            <p>Podes corrigir a informação e submeter novamente.</p>
        `
    });
}

async function enviarEmailValidacaoSL(emailSL, nomeSL, nomeConsultor, nomeBadge) {
    await transporter.sendMail({
        from: `"Softinsa Badges" <${process.env.EMAIL_USER}>`,
        to: emailSL,
        subject: 'Pedido pendente de validação final',
        html: `
            <h2>Validação Final Necessária</h2>
            <p>Olá ${nomeSL},</p>
            <p>Um pedido foi aprovado pelo Talent Manager e encontra-se pendente da tua validação final.</p>
            <ul>
                <li><strong>Consultor:</strong> ${nomeConsultor}</li>
                <li><strong>Badge:</strong> ${nomeBadge}</li>
            </ul>
            <p>Acede à plataforma para concluir a avaliação.</p>
        `
    });
}

module.exports = {
    enviarCodigoRecuperacao,
    enviarEmailBoasVindas,
    enviarEmailNovoPedidoTM,
    enviarEmailPedidoSubmetido,
    enviarEmailPedidoDevolvido,
    enviarEmailValidacaoSL
};
