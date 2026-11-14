# Ps2 Only - tienda

Aplicación de gestión con HTML, CSS, JavaScript, Bootstrap, Node.js, Express y MySQL. El frontend consulta la API; los roles y permisos se validan en el servidor.

## Preparación

1. Inicia MySQL y ejecuta `Ps2.sql` en MySQL Workbench o en tu cliente MySQL. El script crea/actualiza el esquema e inserta datos de demostración; puede ejecutarse más de una vez.
2. En una terminal, desde esta carpeta, ejecuta `npm --prefix Backend install` y luego `npm start`.
3. Abre `http://localhost:3000` en el navegador. El servidor publica el frontend y la API; Bootstrap se carga desde CDN, por lo que la computadora debe tener acceso a Internet para sus estilos y componentes.

La configuración de base de datos por defecto es `localhost:3306`, usuario `root`, contraseña vacía y base `Ps2`. Puede ajustarse con `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME`. Configura también `JWT_SECRET` con una clave propia antes de publicar el sistema. El backend usa una clave local de desarrollo cuando esa variable no está definida.

## Cuentas de demostración

- Administrador: `admin@tienda.com` / `admin123`
- Usuario: `usuario@tienda.com` / `usuario123`

Las contraseñas de ejemplo ya están guardadas como hashes bcrypt. El registro público siempre crea usuarios con rol `usuario`; solo un administrador puede cambiar los roles.

## API

- `GET /productos` y `GET /productos/:id`: catálogo y detalle públicos.
- `POST /productos`, `PUT /productos/:id`, `DELETE /productos/:id`: requieren JWT de administrador.
- `GET /categorias` y `GET /categorias/:id`: consulta pública.
- `POST /categorias`, `PUT /categorias/:id`, `DELETE /categorias/:id`: requieren JWT de administrador.
- `POST /usuarios/registro` y `POST /usuarios/login`: registro y autenticación.
- `GET /usuarios/me` y `PUT /usuarios/:id`: perfil propio autenticado; el usuario no puede modificar otros perfiles ni cambiar su rol.
- `GET /usuarios`, `GET /usuarios/:id` y `DELETE /usuarios/:id`: requieren JWT de administrador.

Para las rutas protegidas, envía el token en `Authorization: Bearer <token>`. El servidor escucha en el puerto `3000` por defecto; puede cambiarse con `PORT`.
