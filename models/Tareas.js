const Sequelize = require("sequelize");
const db = require("../config/db");
const Proyectos = require("./Proyectos");

const Tareas = db.define("tareas", {
  id: {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true,
  },
  tarea: Sequelize.STRING(100),
  estado: Sequelize.INTEGER(1),
});
//Como llave foránea
Tareas.belongsTo(Proyectos);
//Otro tipo de relación
//  Proyectos.hasMany(Tareas)
//Para ver las llaves foráneas hay que borrar las tablas y volver a correr el programa

module.exports = Tareas;
