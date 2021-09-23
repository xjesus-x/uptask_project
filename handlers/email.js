const nodemailer = require("nodemailer");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const util = require("util");
const emailConfig = require("../config/email");

let transport = nodemailer.createTransport({
  host: emailConfig.host,
  posrt: emailConfig.port,
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});

//Generar el HTML
const generarHTML = (archivo, opciones = {}) => {
  const html = pug.renderFile(
    `${__dirname}/../views/emails/${archivo}.pug`,
    opciones
  );
  //Agrega los estilos
  return juice(html);
};

//Exportando la función
exports.enviar = async (opciones) => {
  const html = generarHTML(opciones.archivo, opciones);
  const text = htmlToText.htmlToText(html);
  let opcionesEmail = {
    from: "UpTask <no-reply@uptask.com>",
    to: opciones.usuario.email,
    subject: opciones.subject,
    text,
    html,
  };

  //sendMail no soporta asincronía, se arregla con util
  const enviarEmail = util.promisify(transport.sendMail, transport);
  return enviarEmail.call(transport, opcionesEmail);
};

/* Antes
let mailOptions = {
  from: "UpTask <no-reply@uptask.com>",
  to: "correo@correo.com",
  subject: "Password Reset",
  text: "Hola",
  html: generarHTML(),
};

transport.sendMail(mailOptions);
*/
