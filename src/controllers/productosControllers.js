const { listarProductos } = require('../models/productosModel.js');

const listarProductosController = async (req, res) => {
    try {
        const productos = await listarProductos();
        return res.status(200).json({
            ListadoProductos: productos
        });
    } catch (error) {
        return res.status(500).json({
            error: "Error al listar los productos",
            detalle: error.message
        });
    }
};

const listarUnProducto =(req,res)=>{
    res.json({mensaje: "producto listado"})
};

const crearProducto =(req,res)=>{
    res.json({mensaje: "producto creado con exito"})
};

const eliminarProducto =(req,res)=>{
    res.json({mensaje: "producto eliminado con exito"})
};

module.exports = {
    listarProductosController,
    listarUnProducto,
    crearProducto,
    eliminarProducto
};