const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD  // Google App Password
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

module.exports = { enviarCodigoRecuperacao };