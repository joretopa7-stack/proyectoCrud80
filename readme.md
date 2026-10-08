# Proyecto CRUD80 — guía explicada

API de práctica construida con **Node.js** y **Express**. El proyecto incluye registro e inicio de sesión de usuarios con contraseñas hasheadas y tokens JWT. Aunque el nombre y las notas originales mencionan productos CRUD, **los módulos de productos están vacíos y esas rutas todavía no funcionan**.

## Requisitos

- Node.js y npm instalados.
- Para probar el proyecto localmente, una terminal y un cliente HTTP como `curl`, Postman o Insomnia.

## Instalación y arranque

Desde la carpeta raíz del proyecto:

```bash
npm install
cp .env.example .env
```

Abre `.env` y define un secreto propio, largo y aleatorio para `JWT_SECRET`. El servidor consulta `PORT`; si no lo defines, utiliza el puerto `3500`. Por ejemplo:

```env
PORT=3500
NODE_ENV=development
JWT_SECRET=reemplaza-esto-por-un-secreto-largo-y-aleatorio
```

Inicia el servidor en modo desarrollo:

```bash
npm run dev
```

La consola debe indicar la dirección local, por defecto `http://localhost:3500`.

> En el `.env.example` original aparecía `MIPUERTO=3030`, pero `src/server.js` no consulta esa variable: consulta `PORT`. Para cambiar el puerto, usa `PORT=3030` en `.env`.

## Estructura del proyecto

```text
src/
├── app.js                         Configura Express y monta las rutas bajo /api
├── server.js                      Arranca el servidor HTTP
├── config/db.js                   Define rutas de archivos JSON locales
├── controllers/
│   ├── usuariosController.js      Lógica HTTP de registro, login y listado
│   └── productosController.js     Pendiente: archivo vacío originalmente
├── middleware/
│   ├── autenticacion.js           Verifica tokens JWT
│   ├── manejadorErrores.js        Formatea errores (aún no montado en app.js)
│   └── registroMiddleware.js      Registra solicitudes (aún no montado en app.js)
├── models/
│   ├── usuariosModel.js           Lee y guarda usuarios en JSON
│   └── productosModel.js          Pendiente: archivo vacío originalmente
├── routes/
│   ├── index.js                   Agrupa los enrutadores disponibles
│   ├── usuariosRoutes.js          Rutas HTTP de usuarios
│   └── productosRoutes.js         Pendiente: archivo vacío originalmente
└── utileria/validaciones.js       Pendiente: archivo vacío originalmente
```

### Flujo de una solicitud

1. `server.js` importa `app.js` y abre el puerto HTTP.
2. `app.js` instala los parsers para JSON y formularios, y monta `routes/index.js` bajo `/api`.
3. `routes/index.js` deriva actualmente las solicitudes `/usuarios` a `usuariosRoutes.js`.
4. El enrutador elige un controlador, que valida los datos y utiliza `usuariosModel.js` cuando necesita consultar o guardar usuarios.
5. El modelo guarda los datos en `datosUsuarios.json`, creado en la raíz cuando hace falta.

## Rutas implementadas

Todas las rutas de usuarios están **públicas** en la configuración actual: `autenticacion.js` existe, pero no se aplica a ninguna ruta.

### Comprobar que el servidor responde

```http
GET http://localhost:3500/
```

### Registrar usuario

```http
POST http://localhost:3500/api/usuarios/registro
Content-Type: application/json
```

```json
{
  "nombre": "Ana Pérez",
  "email": "ana@example.com",
  "password": "una-clave-de-prueba"
}
```

El controlador exige los tres campos. Si el registro se completa, responde con estado `201` y devuelve `id`, `nombre` y `email`, sin incluir la contraseña hasheada. El modelo persiste el registro en `datosUsuarios.json`.

### Iniciar sesión

```http
POST http://localhost:3500/api/usuarios/login
Content-Type: application/json
```

```json
{
  "email": "ana@example.com",
  "password": "una-clave-de-prueba"
}
```

Con credenciales válidas devuelve un token JWT con vigencia de una hora. El secreto de firma se lee desde `JWT_SECRET`.

### Listar usuarios

```http
GET http://localhost:3500/api/usuarios/listado
```

**Hay un defecto pendiente en esta ruta:** el controlador importa el módulo del modelo completo, pero no invoca `listarUsuarios()`. Por eso no devuelve el listado de ejemplo esperado. El modelo contiene una función que retorna dos registros fijos de demostración; esos datos no son los usuarios guardados en el JSON.

## Qué no está implementado todavía

- **CRUD de productos:** controlador, modelo y enrutador de productos estaban vacíos; además el enrutador no está montado. Las notas antiguas que muestran `GET/POST/PUT/DELETE /api/productos` describen ejemplos o requisitos, no endpoints operativos de esta copia.
- **Validaciones reutilizables:** `src/utileria/validaciones.js` estaba vacío. Solo registro e inicio de sesión hacen las comprobaciones visibles en su controlador.
- **Protección de rutas:** el middleware JWT no está conectado a los endpoints. Obtener un token no restringe actualmente el acceso a ninguna ruta.
- **Middlewares de registro y errores:** existen como módulos, pero `app.js` todavía no los registra.
- **Base de datos SQL/Prisma:** pese a algunas dependencias instaladas, el modelo de usuarios usa operaciones síncronas sobre un archivo JSON. No hay conexión activa a PostgreSQL o Prisma en el código revisado.

## Scripts disponibles

- `npm run dev`: ejecuta `node --watch src/server.js` y reinicia el proceso cuando cambian archivos.
- `npm test`: no hay pruebas configuradas; el script del paquete devuelve un mensaje de error de prueba no especificada.

## Notas de seguridad y uso

- No subas el archivo `.env` ni compartas el valor real de `JWT_SECRET`.
- `datosUsuarios.json` almacena hashes de contraseña, no contraseñas en texto plano, siempre que los registros se creen mediante el controlador de registro.
- El almacenamiento JSON síncrono es adecuado para una práctica pequeña, pero no ofrece las garantías de concurrencia ni la robustez de una base de datos para producción.
- Los comentarios agregados explican el comportamiento existente y señalan las partes pendientes; no se implementaron funciones CRUD ni se alteró la lógica de la aplicación.
