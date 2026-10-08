// =====================================================
// MIDDLEWARE DE REGISTRO (LOGGING)
// Registra cada solicitud entrante y cuánto tarda en responder.
// Para activarlo debe instalarse con app.use(registroMiddleware) en app.js.
// En el proyecto recibido todavía no está conectado a la aplicación.
// =====================================================
const registroMiddleware = (req, res, next) => {
    // Guardamos el momento en que llega la solicitud para medir su duración.
    const tiempoInicio = Date.now();

    // Obtenemos la fecha y hora actual en formato UTC.
    const tiempoUTC = new Date().toISOString();

    // Muestra el método, la ruta solicitada y la IP del cliente.
    console.log(
        `[${tiempoUTC}] ${req.method} - ${req.url} - ${req.ip}`
    );

    // El evento 'finish' se dispara cuando Express termina de enviar la respuesta.
    res.on('finish', () => {
        const duracion = Date.now() - tiempoInicio;

        // Muestra el estado HTTP devuelto y el tiempo transcurrido en milisegundos.
        console.log(
            `[${tiempoUTC}] ${req.method} ${req.url} - ` +
            `response ${res.statusCode} - ${duracion} ms`
        );
    });

    // Permite que Express continúe hacia el siguiente middleware o la ruta.
    next();
};

module.exports = registroMiddleware;
