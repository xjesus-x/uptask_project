const express = require("express");
//ES lo mismo que import express from 'express'; pero node no lo soporta
//Implicitamente exporta el index.js de las carpetas
const routes = require("./routes");
//Para leer rutas de directorios
const path = require("path");
//Funciones de ayuda
const helpers = require("./helpers");
//Mensajes para validaciones
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("./config/passport");
//Importar variables de entorno
require("dotenv").config({ path: "variables.env" });

//Conexión a DB
const db = require("./config/db");

//Importar el modelo de la db
require("./models/Proyectos");
require("./models/Tareas");
require("./models/Usuarios");

//Retorna una promesa
db.sync()
  .then(() => console.log("Conectado a BD"))
  .catch((error) => console.log(error));

//Crear app de express
const app = express();

//Carpeta de archivos estáticos
app.use(express.static("public"));

//Habilitar pug
app.set("view engine", "pug");

//Añadir carpeta de vistas
app.set("views", path.join(__dirname, "./views"));

//agregar flash messages
app.use(flash());

app.use(cookieParser());

//Sesiones entre páginas sin volverse a autenticar
app.use(
  session({
    //Ayuda a firmar el cookie
    secret: "supersecreto",
    //Para mantener la sesión aunque no se haga nada
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Haciendo que la función esté disponible en toda la aplicación
app.use((req, res, next) => {
  //console.log(req.user); //Si no está logueado sale undefined
  res.locals.vardump = helpers.vardump;
  res.locals.mensajes = req.flash();
  //Otra forma de ver usuarios logueados y poderlo usar en otras partes
  res.locals.usuario = { ...req.user } || null;
  //next indica que se pase al siguiente midleware, cada app.use es uno
  next();
});

//Habilitar bodyParser para leer datos del formulario
app.use(express.urlencoded({ extended: true }));

app.use("/", routes());

//Servidor y puerto
//Se deja en 0 porque Heroku lo asigna de forma aleatoria y así lo identifica
const host = process.env.HOST || "0.0.0.0";
//Acá es al reves, la variable PORT la pone heroku y si no existe se pone el 3000
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
  console.log("El servidor está funcionando");
});
