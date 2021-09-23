const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.agregarTarea = async (req, res, next) => {
  //Obtener el proyecto en base a url con Sequelize
  const proyecto = await Proyectos.findOne({ where: { url: req.params.url } });
  //Leer el valor del input
  const { tarea } = req.body;
  //estado de la tarea: incompleto
  const estado = 0;
  //Obteniendo el id del proyecto
  const proyectoId = proyecto.id;
  //Insertando en base de datos
  const resultado = await Tareas.create({ tarea, estado, proyectoId });
  //Control de error
  if (!resultado) {
    return next();
  }
  //Redireccionando
  res.redirect(`/proyectos/${req.params.url}`);
};

exports.cambiarEstadoTarea = async (req, res) => {
  const { id } = req.params;
  //En el where no se pone id:id porque se llaman igual
  const tarea = await Tareas.findOne({ where: { id } });

  //Cambio de estado
  let estado = 0;
  if (tarea.estado === estado) {
    estado = 1;
  }
  tarea.estado = estado;

  //Almacenarlo en la base da datos
  const resultado = await tarea.save();

  if (!resultado) return next();

  res.status(200).send("Actualizado en DB");
};

exports.eliminarTarea = async (req, res) => {
  const { id } = req.params;
  //Eliminando tarea
  const resultado = await Tareas.destroy({ where: { id } });

  if (!resultado) return next();

  res.status(200).send("La tarea fue eliminada en la Base de Datos");
};
