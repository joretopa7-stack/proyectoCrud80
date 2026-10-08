// Importa la aplicación Express ya configurada en app.js.
const app = require("./app");

// Usa PORT si está definido en el entorno; de lo contrario, utiliza el puerto 3500.
// Nota: MIPUERTO, presente en .env.example, no se consulta aquí.
const PORT = process.env.PORT || 3500;

// Inicia el servidor HTTP y muestra la dirección local en la consola.
app.listen(PORT, () => {
  console.log(`SERVIDOR EXPRESS: http://localhost:${PORT}`);
});
