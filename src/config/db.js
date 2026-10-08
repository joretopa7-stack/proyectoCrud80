const path = require("path");

// =====================================================
// RUTAS DE ALMACENAMIENTO LOCAL
// =====================================================
// Aunque el nombre del archivo es db.js, actualmente no se configura una
// base de datos SQL ni Prisma. Los modelos guardan la información en archivos
// JSON ubicados en la raíz del proyecto.

// Ruta absoluta al archivo que usaría el modelo de productos.
const rutaProductos = path.join(__dirname, "..", "..", "datosProductos.json");

// Ruta absoluta al archivo donde usuariosModel guarda los usuarios.
const rutaUsuarios = path.join(__dirname, "..", "..", "datosUsuarios.json");

// Exporta las rutas para que los modelos sepan dónde leer y guardar datos.
module.exports = {
    rutaProductos,
    rutaUsuarios
};
