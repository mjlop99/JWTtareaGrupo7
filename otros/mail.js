const nodemailer = require('nodemailer');
require('dotenv').config({path:'../.env'});
console.log('EMAIL_USER:', process.env.PORT); 

// Configuración del transportador
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Función para enviar un correo electrónico
const sendEmail = (to, subject, text,usuario,token) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: `
    <p>Hola ${usuario},</p>
    <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para cambiarla:</p>
    <a href="http://localhost:3000/api/auth/reset-password/${token}">Restablecer Contraseña</a>
  `
    };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error: ', error);
    }
    console.log('Correo enviado: ');
  });
};


module.exports=sendEmail


