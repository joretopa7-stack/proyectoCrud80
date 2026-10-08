// Biblioteca que permite verificar la firma y vigencia de tokens JWT.
const jwtoken = require("jsonwebtoken");

// =====================================================
// MIDDLEWARE DE AUTENTICACIÓN
// Formato esperado: Authorization: Bearer <token>
// =====================================================
// Se coloca antes del controlador de una ruta protegida. Si el token es válido,
// añade sus datos decodificados a req.aprendiz y continúa con next().
const autenticacionToken = (req, res, next) => {

    // Lee el encabezado HTTP Authorization enviado por el cliente.
    const encabezado = req.header("Authorization");

    // Sin encabezado no hay credenciales para autenticar la solicitud.
    if (!encabezado) {
        return res.status(401).json({
            mensaje: "Acceso denegado, no se proveyó un token."
        });
    }

    // Acepta tanto "Bearer <token>" como el token sin el prefijo Bearer.
    const partes = encabezado.split(" ");
    const token = partes.length === 2 ? partes[1] : partes[0];

    if (!token) {
        return res.status(401).json({
            mensaje: "Acceso denegado, no se proveyó un token."
        });
    }

    // Comprueba la firma con el mismo secreto que se usó al crear el token.
    jwtoken.verify(token, process.env.JWT_SECRET, (error, usuario) => {

        // Un token expirado, manipulado o firmado con otro secreto no se acepta.
        if (error) {
            return res.status(403).json({
                mensaje: "Token inválido"
            });
        }

        // Deja los datos incluidos en el token disponibles para la siguiente función.
        req.aprendiz = usuario;

        // Continúa la cadena de Express (otro middleware o el controlador).
        next();
    });
};

module.exports = autenticacionToken;
