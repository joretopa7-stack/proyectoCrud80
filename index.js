import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const puerto = process.env.PORT || 3030; // Usamos PORT, como lo dejaste en tu .env

app.use(express.json());

// Ruta raíz de prueba
app.get("/", (req, res) => {
    res.send("<h1>Api Rest Productos la 80</h1>");
});

// --- Configuración del archivo JSON ---
const productosPath = path.join(__dirname, 'datosProductos.json');

const leerProductos = () => {
    try {
        const data = fs.readFileSync(productosPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const escribirProductos = (productos) => {
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));
};

// --- ENDPOINTS CRUD (Misma lógica que CommonJS) ---

// GET /api/products - Listar todos
app.get('/api/products', (req, res) => {
    res.json(leerProductos());
});

// GET /api/products/:id - Obtener por ID
app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const productos = leerProductos();
    const producto = productos.find(p => p.id === id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
});

// POST /api/products - Crear producto
app.post('/api/products', (req, res) => {
    const { nombre, precio, stock, categoria } = req.body;
    if (!nombre || !precio || stock === undefined || !categoria) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }
    if (typeof precio !== 'number' || precio <= 0) {
        return res.status(400).json({ mensaje: 'Precio debe ser número > 0' });
    }
    if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
        return res.status(400).json({ mensaje: 'Stock debe ser entero >= 0' });
    }
    const productos = leerProductos();
    const nuevoId = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;
    const nuevoProducto = { id: nuevoId, nombre, precio, stock, categoria, imagen: null };
    productos.push(nuevoProducto);
    escribirProductos(productos);
    res.status(201).json(nuevoProducto);
});

// PUT /api/products/:id - Actualizar producto
app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, precio, stock, categoria } = req.body;
    if (!nombre || !precio || stock === undefined || !categoria) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }
    if (typeof precio !== 'number' || precio <= 0) {
        return res.status(400).json({ mensaje: 'Precio debe ser número > 0' });
    }
    if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
        return res.status(400).json({ mensaje: 'Stock debe ser entero >= 0' });
    }
    let productos = leerProductos();
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    productos[index] = { ...productos[index], nombre, precio, stock, categoria };
    escribirProductos(productos);
    res.json(productos[index]);
});

// DELETE /api/products/:id - Eliminar producto
app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let productos = leerProductos();
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    productos.splice(index, 1);
    escribirProductos(productos);
    res.status(204).send();
});

// --- Levantar el servidor ---
app.listen(puerto, () => {
    console.log(`SERVIDOR: http://localhost:${puerto}`);
});