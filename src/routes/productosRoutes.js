const { Router } = require('express');
const { listarProductosController } = require('../controllers/productosControllers.js');
const { listarUnProducto } = require('../controllers/productosControllers.js');
const { crearProducto} = require('../controllers/productosControllers.js');
const { eliminarProducto} = require('../controllers/productosControllers.js');

const router = Router();

// Ruta final complementaria para formar /api/listar/productos
router.get('/productos', listarProductosController);
router.get('/productos', listarUnProducto);
router.get('/productos', crearProducto);
router.get('/productos', eliminarProducto);



module.exports = router;