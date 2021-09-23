const express = require("express");

const router = express.Router();

//Importar validator
const { body } = require("express-validator");

//Importamos el controlador
const proyectosController = require("../controllers/proyectosController");
const tareasController = require("../controllers/tareasController");
const usuariosController = require("../controllers/usuariosController");
const authController = require("../controllers/authController");

module.exports = function () {
  router.get(
    "/",
    authController.usuarioAutenticado,
    proyectosController.proyectosHome
  );

  router.get(
    "/nuevo-proyecto",
    authController.usuarioAutenticado,
    proyectosController.formularioProyecto
  );

  router.post(
    "/nuevo-proyecto",
    authController.usuarioAutenticado,

    body("nombre").not().isEmpty().trim().escape(),
    proyectosController.nuevoProyecto
  );

  //Webs de proyectos
  router.get(
    "/proyectos/:url",
    authController.usuarioAutenticado,

    proyectosController.proyectoPorUrl
  );

  //Web para editar proyecto
  router.get(
    "/proyecto/editar/:id",
    authController.usuarioAutenticado,

    proyectosController.formuarioEditar
  );

  router.post(
    "/nuevo-proyecto/:id",
    authController.usuarioAutenticado,

    body("nombre").not().isEmpty().trim().escape(),
    proyectosController.actualizarProyecto
  );

  //Eliminar, petición viene de axios
  router.delete(
    "/proyectos/:url",
    authController.usuarioAutenticado,

    proyectosController.eliminarProyecto
  );

  //Agregar tarea
  router.post(
    "/proyectos/:url",
    authController.usuarioAutenticado,

    tareasController.agregarTarea
  );

  //Actualizar estado de tarea
  router.patch(
    "/tareas/:id",
    authController.usuarioAutenticado,

    tareasController.cambiarEstadoTarea
  );

  //Eliminar tarea
  router.delete(
    "/tareas/:id",
    authController.usuarioAutenticado,

    tareasController.eliminarTarea
  );

  //Creación de usuarios
  //Vista
  router.get("/crear-cuenta", usuariosController.formCrearCuenta);
  //Creación en DB
  router.post("/crear-cuenta", usuariosController.crearCuenta);
  router.get("/confirmar/:correo", usuariosController.confirmarCuenta);

  //Iniciar sesión
  //Vista
  router.get("/iniciar-sesion", usuariosController.formIniciarSesion);
  //Autenticación
  router.post("/iniciar-sesion", authController.autenticarUsuario);

  //Cerrar sesion
  router.get("/cerrar-sesion", authController.cerrarSesion);

  //Restablecer contraseña
  router.get("/restablecer", usuariosController.formRestablecerPassword);
  router.post("/restablecer", authController.enviarToken);
  router.get("/restablecer/:token", authController.validarToken);
  router.post("/restablecer/:token", authController.actualizarPassword);

  return router;
};
