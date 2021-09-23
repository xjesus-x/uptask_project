const passport = require("passport");
const Usuarios = require("../models/Usuarios");
const crypto = require("crypto");
const { Sequelize } = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");
const enviarEmail = require("../handlers/email");

exports.autenticarUsuario = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/iniciar-sesion",
  failureFlash: true,
  badRequestMessage: "Ingresa tus credenciales",
});

//Función para revisar si el usuario está logueado
exports.usuarioAutenticado = (req, res, next) => {
  //Si está autenticado
  if (req.isAuthenticated()) {
    return next();
  }

  //Si no está autenticado, redirigir al formulario
  return res.redirect("/iniciar-sesion");
};

//Función para cerrar sesión
exports.cerrarSesion = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/iniciar-sesion");
  });
};

//Generar token para restablecer contraseña
exports.enviarToken = async (req, res) => {
  //verificar que correo existe en db
  const usuario = await Usuarios.findOne({ where: { email: req.body.email } });

  //Si no existe el usuario
  if (!usuario) {
    req.flash("error", "No existe esa cuenta");
    res.render("restablecer", {});
  }

  //Generando token si el usuario existe y fecha de expiración
  usuario.token = crypto.randomBytes(20).toString("hex");
  //expiración de una hora
  usuario.expiracion = Date.now() + 3600000;

  //Guardar en la db, en lugar de update se usa save porque ya se tiene identificado el objeto
  await usuario.save();

  //Generar url del token
  const resetUrl = `http://${req.headers.host}/restablecer/${usuario.token}`;

  //Enviar correo con token
  await enviarEmail.enviar({
    usuario,
    subject: "Password reset",
    resetUrl,
    archivo: "restablecer-password",
  });

  req.flash("correcto", "Se envió un mensaje a tu correo");
  res.redirect("/iniciar-sesion");
};

exports.validarToken = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: { token: req.params.token },
  });

  //Si el token no existe
  if (!usuario) {
    req.flash("error", "No válido");
    res.redirect("/restablecer");
  }

  //Formulario para generar password
  res.render("resetPassword", {
    nombrePagina: "Restablecer Contraseña",
  });
};

//Verificar token, expiración y cambiar contraseña
exports.actualizarPassword = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      token: req.params.token,
      expiracion: {
        //Operador >= en Sequelize
        [Op.gte]: Date.now(),
      },
    },
  });

  //Si no es válido
  if (!usuario) {
    req.flash("error", "Acción no válida");
    res.redirect("/restablecer");
  }

  //Hashear nuevo pássword y limpiar campos
  usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8));
  usuario.token = null;
  usuario.expiracion = null;
  usuario.email = usuario.email;

  //Guardar en db

  await usuario.save();

  req.flash("correcto", "La contraseña se ha modificado");

  res.redirect("/iniciar-sesion");
};
