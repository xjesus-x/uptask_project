const Sequelize = require("sequelize");
const db = require("../config/db");
const Proyectos = require("../models/Proyectos");
//Ya no se usa
//const bcrypt = require("bcrypt-nodejs");
const bcrypt = require("bcrypt");

const Usuarios = db.define(
  "usuarios",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Agrega un correo válido",
        },
        notEmpty: {
          msg: "El correo no puede estar vacía",
        },
      },
      unique: {
        args: true,
        msg: "Usuario ya registrado",
      },
    },
    password: {
      type: Sequelize.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "La contraseña no puede estar vacía",
        },
      },
    },
    activo: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE,
  },
  {
    hooks: {
      beforeCreate(usuario) {
        usuario.password = bcrypt.hashSync(
          usuario.password,
          bcrypt.genSaltSync(8)
        );
      },
    },
  }
);

//Con prototype, todos los objeto Usuarios van a tener esa función
//Se está haciendo para la verificación que se realiza en passport
Usuarios.prototype.verificarPassword = function (password) {
  //Retrona un true o false
  return bcrypt.compareSync(password, this.password);
};

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;
