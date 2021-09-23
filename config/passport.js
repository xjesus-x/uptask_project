const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

//Referencia al modelo en el que se va a autenticar
const Usuarios = require("../models/Usuarios");

passport.use(
  new LocalStrategy(
    //Por defecto autentica con usuario y password, hayq eu cambiar a email y password
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const usuario = await Usuarios.findOne({
          where: { email: email, activo: 1 },
        });
        //Password incorrecto
        if (!usuario.verificarPassword(password)) {
          return done(null, false, {
            message: "Password incorrecto",
          });
        }
        //Usuario y password correcto. Retorna el usario
        return done(null, usuario);
      } catch (error) {
        //Usuario no existe
        return done(null, false, {
          message: "La cuenta no existe",
        });
      }
    }
  )
);

//Serializar el usuario
//serializeUser() is called when the user logs in; it decides what is stored in the cookie
passport.serializeUser((usuario, callback) => {
  callback(null, usuario);
});

//deserializar el usuario
//deserializeUser() is called on each request; it loads user data based on cookie's contents
passport.deserializeUser((usuario, callback) => {
  callback(null, usuario);
});

module.exports = passport;
