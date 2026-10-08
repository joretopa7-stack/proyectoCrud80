// Se usa para reconocer errores lanzados al procesar cargas de archivo con Multer.
const multer = require("multer");

// =====================================================
// MIDDLEWARE DE MANEJO DE ERRORES
// Debe registrarse al final de la configuración de Express, después de las rutas.
// Express lo identifica como manejador de errores por sus cuatro parámetros.
// Nota: en la app recibida aún no está conectado con app.use(...).
// =====================================================
const manejadorErrores = (err, req, res, next) => {

    // Convierte errores de Multer (por ejemplo, límites de subida) en HTTP 400.
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            mensaje: "Error al subir la imagen",
            error: err.message
        });
    }

    // Si el error define statusCode se respeta; en caso contrario se usa 500.
    const codigoEstado = err.statusCode || 500;
    const mensaje = err.message || "Error inesperado.";
    const fecha = new Date().toISOString();

    // Los detalles completos se guardan en la consola del servidor para diagnóstico.
    console.error(
        `Fecha: ${fecha} - Estado: ${codigoEstado} - Mensaje: ${mensaje}`
    );

    if (err.stack) {
        console.error(err.stack);
    }

    // Respuesta JSON uniforme. La traza solo se incluye en modo desarrollo.
    res.status(codigoEstado).json({
        estado: codigoEstado,
        error: mensaje,
        fecha: fecha,
        // Más detalles solo cuando estamos en desarrollo
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
};

module.exports = manejadorErrores;
