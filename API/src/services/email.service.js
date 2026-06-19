const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Endereço remetente — deve ser um domínio verificado no Resend
// Durante desenvolvimento podes usar: onboarding@resend.dev (só envia para o teu próprio email)
const FROM = `"Softinsa Badges" <${process.env.EMAIL_FROM ?? 'onboarding@resend.dev'}>`;

async function enviarCodigoRecuperacao(email, codigo) {
    /* const { error } = await resend.emails.send({
        from: FROM,
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

    if (error) throw new Error(`Resend error: ${error.message}`); */
    console.log("teste");
}

async function enviarEmailBoasVindas(email, nome) {
   /*  const { error } = await resend.emails.send({
        from: FROM,
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

    if (error) throw new Error(`Resend error: ${error.message}`); */
    console.log("teste");
}

async function enviarEmailNovoPedidoTM(emailTM, nomeTM, nomeConsultor, nomeBadge) {
    /* const { error } = await resend.emails.send({
        from: FROM,
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

    if (error) throw new Error(`Resend error: ${error.message}`); */
    console.log("teste");
}

async function enviarEmailPedidoSubmetido(email, nome, nomeBadge) {
    /* const { error } = await resend.emails.send({
        from: FROM,
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

    if (error) throw new Error(`Resend error: ${error.message}`); */
    console.log("teste");
}

async function enviarEmailPedidoDevolvido(email, nome, nomeBadge, motivo) {
    /* const { error } = await resend.emails.send({
        from: FROM,
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

    if (error) throw new Error(`Resend error: ${error.message}`); */
    console.log("teste");
}

async function enviarEmailValidacaoSL(emailSL, nomeSL, nomeConsultor, nomeBadge) {
    /* const { error } = await resend.emails.send({
        from: FROM,
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

    if (error) throw new Error(`Resend error: ${error.message}`); */

    console.log("teste");
}

module.exports = {
    enviarCodigoRecuperacao,
    enviarEmailBoasVindas,
    enviarEmailNovoPedidoTM,
    enviarEmailPedidoSubmetido,
    enviarEmailPedidoDevolvido,
    enviarEmailValidacaoSL
};
