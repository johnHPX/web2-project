const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendEmail(email, code) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Seu código de acesso - Claquete API',
    text: `Seu código de autenticação é: ${code}. Ele expira em 10 minutos.`
  });
}

module.exports = { sendEmail }