// Este modelo concentra las operaciones de lectura y escritura de usuarios.
// La persistencia actual es un archivo JSON local, no una base de datos SQL.
const fs = require("fs");
const { rutaUsuarios } = require("../config/db");

// =====================================================
// ASEGURAR QUE EL ARCHIVO DE USUARIOS EXISTA
// =====================================================

function asegurarArchivo() {
    // En el primer uso se crea el archivo con una lista vacía de usuarios.
    if (!fs.existsSync(rutaUsuarios)) {
        fs.writeFileSync(rutaUsuarios, JSON.stringify([], null, 2));
    }
}

// =====================================================
// LEER / GUARDAR USUARIOS
// =====================================================

function leerUsuarios() {
    asegurarArchivo();
    // Lee el texto UTF-8 y lo convierte de JSON a un arreglo de objetos.
    const datos = fs.readFileSync(rutaUsuarios, "utf-8");
    return JSON.parse(datos);
}

function guardarUsuarios(usuarios) {
    // Reemplaza el archivo completo con el arreglo actualizado, con sangría legible.
    fs.writeFileSync(rutaUsuarios, JSON.stringify(usuarios, null, 2));
}

// =====================================================
// BUSCAR USUARIO POR EMAIL
// =====================================================

function buscarPorEmail(email) {
    const usuarios = leerUsuarios();
    // Devuelve el primer usuario cuyo correo coincida exactamente o undefined.
    return usuarios.find(usuario => usuario.email === email);
}

// =====================================================
// CREAR USUARIO
// =====================================================

function crearUsuario({ nombre, email, password }) {
    const usuarios = leerUsuarios();

    // Calcula un ID consecutivo a partir del ID más alto; empieza en 1 si no hay usuarios.
    const nuevoId = usuarios.length > 0
        ? Math.max(...usuarios.map(usuario => usuario.id)) + 1
        : 1;

    const nuevoUsuario = {
        id: nuevoId,
        nombre,
        email,
        password // ya viene hasheado desde el controller; no debería ser texto plano
    };

    // Agrega el usuario al arreglo, guarda el archivo y devuelve el registro creado.
    usuarios.push(nuevoUsuario);
    guardarUsuarios(usuarios);

    return nuevoUsuario;
}

// =====================================================
// LISTADO DE EJEMPLO
// =====================================================
const listarUsuarios = ()=>{
    // Datos fijos de demostración: no se leen desde datosUsuarios.json.
    const datos =[
        {"nombre": "Jhonny", "cargo":"Instructor", "Ficha":3407180},
        {"nombre": "Ana", "cargo":"Aprendiz", "Ficha":3407180}
    ]
    return datos
}

// Expone las operaciones para que los controladores las puedan utilizar.
module.exports = {
    leerUsuarios,
    guardarUsuarios,
    buscarPorEmail,
    crearUsuario,
    listarUsuarios
};
