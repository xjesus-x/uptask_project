const sequelize = require("sequelize");
const slug = require("slug");
const shortid = require("shortid");

const db = require("../config/db");

const Proyectos = db.define(
  "proyectos",
  {
    id: {
      type: sequelize.INTEGER(11),
      primaryKey: true,
      autoIncrement: true,
    },

    //Cuando solo define un elemento no es necesario poner llaves y type
    nombre: sequelize.STRING,
    url: sequelize.STRING,
    usuariosId: sequelize.STRING,
  },
  {
    hooks: {
      beforeCreate(proyecto) {
        const url = slug(proyecto.nombre).toLowerCase();

        proyecto.url = `${url}-${shortid.generate()}`;
      },
    },
  }
);

module.exports = Proyectos;
