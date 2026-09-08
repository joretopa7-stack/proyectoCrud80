require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const puerto = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta raíz
app.get("/", (req, res) => {
    res.send("<h1>Api Rest Productos la 80</h1>");
});

// Ruta para productos
const productosPath = path.join(__dirname, 'datosProductos.json');

// Función auxiliar para leer productos
const leerProductos = () => {
    try {
        const data = fs.readFileSync(productosPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Función auxiliar para escribir productos
const escribirProductos = (productos) => {
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));
};

// Obtener todos los productos
app.get('/api/products', (req, res) => {
    const productos = leerProductos();
    res.json(productos);
});

// Obtener un producto por ID
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productos = leerProductos();
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
});

// Crear un producto (POST)
app.post('/api/products', (req, res) => {
    const { nombre, precio, stock, categoria } = req.body;
    // Validaciones
    if (!nombre || !precio || stock === undefined || !categoria) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nombre, precio, stock, categoria' });
    }
    if (typeof precio !== 'number' || precio <= 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser un número mayor a 0' });
    }
    if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
        return res.status(400).json({ mensaje: 'El stock debe ser un entero positivo o 0' });
    }

    const productos = leerProductos();
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
    const nuevoProducto = {
        id: nuevoId,
        nombre,
        precio,
        stock,
        categoria,
        imagen: null // o "sin imagen"
    };
    productos.push(nuevoProducto);
    escribirProductos(productos);
    res.status(201).json(nuevoProducto);
});

// Actualizar un producto (PUT)
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, precio, stock, categoria } = req.body;
    // Validaciones similares
    if (!nombre || !precio || stock === undefined || !categoria) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nombre, precio, stock, categoria' });
    }
    if (typeof precio !== 'number' || precio <= 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser un número mayor a 0' });
    }
    if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
        return res.status(400).json({ mensaje: 'El stock debe ser un entero positivo o 0' });
    }

    let productos = leerProductos();
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    // Actualizar manteniendo el id y la imagen existente (o null)
    productos[index] = {
        ...productos[index],
        nombre,
        precio,
        stock,
        categoria,
        // imagen se conserva la que tenía
    };
    escribirProductos(productos);
    res.json(productos[index]);
});

// Eliminar un producto (DELETE)
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let productos = leerProductos();
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    productos.splice(index, 1);
    escribirProductos(productos);
    res.status(204).send(); // Sin contenido
});

// Levantar el servidor
app.listen(puerto, () => {
    console.log(`SERVIDOR: http://localhost:${puerto}`);
});