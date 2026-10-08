// Este archivo configura la aplicación Express, pero no la pone a escuchar
// en un puerto. El arranque del servidor se realiza en src/server.js.
const express = require("express");

// Carga las variables definidas en el archivo .env (por ejemplo, JWT_SECRET).
require("dotenv").config();

// Importa el enrutador que reúne las rutas disponibles de la API.
const enrutador = require("./routes");
const app = express();

// Middleware para interpretar cuerpos JSON y formularios URL-encoded.
// Gracias a ellos, los datos enviados por el cliente quedan disponibles en req.body.
app.use(express.json());
app.use(express.urlencoded());

// Todas las rutas del enrutador se publican bajo el prefijo /api.
// Ejemplo: una ruta /usuarios/login queda disponible como /api/usuarios/login.
app.use("/api", enrutador);

// Ruta raíz sencilla para comprobar que el servidor responde.
app.get("/", (req, res) => {
  res.send("Enpoint raiz de nuestra API Rest 3407180");
});

// Exportar la aplicación permite que server.js la inicie y facilita pruebas.
module.exports = app;
