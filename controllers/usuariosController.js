const Usuarios = require("../models/Usuarios");
const enviarEmail = require("../handlers/email");

exports.formCrearCuenta = (req, res) => {
  res.render("crearCuenta", {
    nombrePagina: "Crear cuenta en UpTask",
  });
};

exports.formIniciarSesion = (req, res) => {
  const { error } = res.locals.mensajes;
  res.render("iniciarSesion", {
    nombrePagina: "Iniciar sesión en UpTask",
    error: error,
  });
};

exports.crearCuenta = async (req, res) => {
  //leer datos
  const { email, password } = req.body;

  try {
    //crear usuario en db
    await Usuarios.create({
      email,
      password,
    });

    //Crear URL de confirmar
    const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

    //Crear objeto usuario
    const usuario = {
      email,
    };
    //Enviar email
    await enviarEmail.enviar({
      usuario,
      subject: "Confirmar tu cuenta en UpTask",
      confirmarUrl,
      archivo: "confirmar-cuenta",
    });

    //Redirigir
    req.flash("correcto", "Enviamos un correo, confirma tu cuenta");
    res.redirect("/iniciar-sesion");
  } catch (error) {
    //Genera el objeto de errores
    req.flash(
      "error",
      error.errors.map((error) => error.message)
    );
    res.render("crearCuenta", {
      mensajes: req.flash(),
      nombrePagina: "Crear cuenta en UpTask",
      email: email,
      password,
    });
  }
};

exports.formRestablecerPassword = (req, res) => {
  res.render("restablecer", {
    nombrePagina: "Restablecer contraseña",
  });
};

//Activar cuenta
exports.confirmarCuenta = async (req, res) => {
  const usuario = await Usuarios.findOne({
    where: {
      email: req.params.correo,
    },
  });

  //Si no existe usuario con ese correo
  if (!usuario) {
    req.flash("error", "Usuario no válido");
    res.redirect("/crear-cuenta");
  }

  usuario.activo = 1;
  await usuario.save();

  req.flash("correcto", "Tu cuenta ha sido activada");
  res.redirect("/iniciar-sesion");
};
