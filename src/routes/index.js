// Este módulo reúne los enrutadores de recursos bajo un único enrutador raíz.
const { Router } = require("express");
const usuariosRouter = require("./usuariosRoutes");
const enrutador = Router();

// El montaje se combina con el prefijo /api configurado en app.js.
// Así, por ejemplo, usuariosRouter.post('/login', ...) queda en /api/usuarios/login.
enrutador.use("/usuarios", usuariosRouter);

// productosRoutes.js existe, pero está vacío y todavía no se monta aquí.

module.exports = enrutador;
