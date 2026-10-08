const express = require("express");
const router = express.Router();
const { registrar, iniciarSesion, listarController } = require("../controllers/usuariosController");

// Estas rutas quedan públicas porque no se aplica autenticacionToken en ellas.
// POST /api/usuarios/registro: valida los datos y registra una cuenta.
router.post("/registro", registrar);

// POST /api/usuarios/login: comprueba credenciales y devuelve un JWT.
router.post("/login", iniciarSesion);

// GET /api/usuarios/listado: llama al controlador del listado de usuarios.
// El controlador tiene una observación pendiente descrita en readme.md.
router.get("/listado", listarController);

module.exports = router;
