//Importar el modelo de la db, ya tiene la conexión
const Proyectos = require("../models/Proyectos");
const Tareas = require("../models/Tareas");

exports.proyectosHome = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  res.render("index", {
    nombrePagina: "Proyectos",
    //Controlador le pasa los datos a la vista
    proyectos,
  });
  //res.send("Hola texto");
};

exports.formularioProyecto = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });
  res.render("nuevoProyecto", {
    nombrePagina: "Nuevo Proyecto",
    proyectos,
  });
};

exports.nuevoProyecto = async (req, res) => {
  //Ver en cmd lo que se envía (requiere usar url encoder)
  //console.log(req.body)
  const usuarioId = res.locals.usuario.id;
  const proyectos = await Proyectos.findAll({ where: { usuarioId } });

  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: "Agrega nombre al proyecto" });
  }

  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {
    //Insertar en db la variable del nombre del proyecto
    //De forma asincrona
    //Accediento a variable local usuario creada en index
    const usuarioId = res.locals.usuario.id;
    await Proyectos.create({ nombre, usuarioId });
    res.redirect("/");
  }
};

exports.proyectoPorUrl = async (req, res, next) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

  //Es mejor solo usar el await en una parte como promesa

  const proyectoPromise = Proyectos.findOne({
    where: {
      url: req.params.url,
      usuarioId,
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  //Consultar tareas del proyecto
  const tareas = await Tareas.findAll({
    where: {
      proyectoId: proyecto.id,
    },
    //Haciendo un join con el ORM, trayendo el modelo que se quiere unir
    //include: [
    //{model: Proyectos}
    //]
  });
  //Si no hay proyectos con esa url detiene el código y manda al siguiente midddleware
  if (!proyecto) return next();

  //Render para mostrar tareas
  res.render("tareas", {
    nombrePagina: "Tareas del Proyecto",
    proyectos,
    proyecto,
    tareas,
  });
};

exports.formuarioEditar = async (req, res) => {
  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

  //Es mejor solo usar el await en una parte como promesa

  const proyectoPromise = Proyectos.findOne({
    where: {
      //id porque así se llama el parámetro de la url
      id: req.params.id,
      usuarioId,
    },
  });

  const [proyectos, proyecto] = await Promise.all([
    proyectosPromise,
    proyectoPromise,
  ]);

  res.render("nuevoProyecto", {
    nombrePagina: "Editar Proyecto",
    proyectos,
    proyecto,
  });
};

exports.actualizarProyecto = async (req, res) => {
  //Ver en cmd lo que se envía (requiere usar url encoder)
  //console.log(req.body)

  const usuarioId = res.locals.usuario.id;
  const proyectosPromise = Proyectos.findAll({ where: { usuarioId } });

  const { nombre } = req.body;

  let errores = [];

  if (!nombre) {
    errores.push({ texto: "Agrega nombre al proyecto" });
  }

  if (errores.length > 0) {
    res.render("nuevoProyecto", {
      nombrePagina: "Nuevo Proyecto",
      errores,
      proyectos,
    });
  } else {
    // aquí no se ejecuta el hook beforeCreate, porque es para cuando se crean elementos
    // Se puede usar un hook beforeUpdate, pero no conviene cambiar la url para que se conserve todo en orden
    await Proyectos.update(
      { nombre: nombre },
      { where: { id: req.params.id } }
    );
    res.redirect("/");
  }
};

exports.eliminarProyecto = async (req, res, next) => {
  //req contiene query y params, en query viene la variable del axios y en la otra y en la otra el parámetro de la :url
  //console.log(req.params);

  const { urlProyecto } = req.query;

  const resultado = await Proyectos.destroy({ where: { url: urlProyecto } });

  //Si no hubo resultado manda al siguiente middleware
  if (!resultado) {
    return next();
  }

  res.status(200).send("Proyecto eliminado correctamente");
};
