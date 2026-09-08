// importacion del paquete de express, tradicional (require)
const express = require("express");

// creacion de mi aplicacion de express
const app = express();
const puerto = 3000;

// endpoint raiz
app.get("/", (req, res) => {
    res.send("<h1>Api Rest Productos la 80</h1>");
});

// levantamos el servidor
app.listen(puerto, () => {
    console.log(`SERVIDOR: http://localhost:${puerto}`);
});