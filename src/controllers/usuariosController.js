// El controlador recibe las solicitudes HTTP, valida datos de entrada y
// prepara la respuesta. El acceso a los datos de usuarios se delega al modelo.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const usuariosModel = require("../models/usuariosModel");

// Se conserva esta importación tal como estaba en el proyecto. Actualmente
// contiene el objeto exportado por el modelo, no el resultado de listarUsuarios().
const listarUsuarios = require("../models/usuariosModel");

// =====================================================
// POST /api/usuarios/registro
// =====================================================

const registrar = async (req, res) => {
    try {
        // Extrae del cuerpo JSON los campos necesarios para crear la cuenta.
        const { nombre, email, password } = req.body;

        // Rechaza la solicitud si falta cualquiera de los datos requeridos.
        if (!nombre || !email || !password) {
            return res.status(400).json({
                mensaje: "Nombre, email y password son obligatorios"
            });
        }

        // Evita registrar dos cuentas con la misma dirección de correo.
        const existente = usuariosModel.buscarPorEmail(email);

        if (existente) {
            return res.status(409).json({
                mensaje: "Ya existe un usuario registrado con ese email"
            });
        }

        // Nunca se debe guardar la contraseña en texto plano: se genera un salt
        // y se calcula un hash seguro con bcrypt antes de llamar al modelo.
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Crea y persiste el usuario; el campo password recibido aquí ya es un hash.
        const nuevoUsuario = usuariosModel.crearUsuario({
            nombre,
            email,
            password: passwordHash
        });

        // Devuelve 201 (creado) y omite el hash para no exponerlo en la respuesta.
        res.status(201).json({
            mensaje: "Usuario registrado correctamente",
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email
            }
        });

    } catch (error) {
        // Registra el detalle en el servidor, pero responde con un mensaje genérico.
        console.error(error);
        res.status(500).json({ mensaje: "Error al registrar el usuario" });
    }
};

// =====================================================
// POST /api/usuarios/login
// =====================================================

const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Sin ambos campos no es posible comprobar las credenciales.
        if (!email || !password) {
            return res.status(400).json({
                mensaje: "Email y password son obligatorios"
            });
        }

        // Busca al usuario por correo. El modelo lee el archivo JSON local.
        const usuario = usuariosModel.buscarPorEmail(email);

        // Se usa el mismo mensaje ante correo inexistente o contraseña errónea,
        // evitando revelar cuál de los dos datos falló.
        if (!usuario) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        // Compara la contraseña recibida con el hash guardado; no los compara como texto.
        const passwordValido = await bcrypt.compare(password, usuario.password);

        if (!passwordValido) {
            return res.status(401).json({ mensaje: "Credenciales inválidas" });
        }

        // Firma un JWT con datos básicos del usuario. JWT_SECRET debe estar definido
        // en el entorno; el token generado vence después de una hora.
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // El cliente debe conservar el token y enviarlo al acceder a rutas protegidas.
        res.status(200).json({
            mensaje: "Sesión iniciada correctamente",
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al iniciar sesión" });
    }
};

// =====================================================
// GET /api/usuarios/listado
// =====================================================
// El modelo exporta una función listarUsuarios() con datos de ejemplo.
// Observación: en este controlador se asigna el módulo completo a listarUsuarios
// y luego se espera ese objeto; no se invoca la función del modelo. Por eso,
// la respuesta actual no contiene el listado esperado (ver readme.md).
const listarController = async(req, res)=>{
    const usuarios = await listarUsuarios
    try {
        // La intención aparente es enviar el listado obtenido desde el modelo.
        res.status(200).json({Listado: usuarios})
    } catch (error) {
       res.status(500).json({Error: error.message})
    }

}

// Exporta los controladores para que usuariosRoutes.js los asigne a las rutas.
module.exports = {
    registrar,
    iniciarSesion,
    listarController
};
