const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'Ps2Only-clave-de-desarrollo-cambiar';

// Verifica los datos de entrada sin confiar en el rol que mande el cliente.
function validarCredenciales(data, registro = false) {
  const errores = [];
  if (registro && (typeof data.nombre !== 'string' || !data.nombre.trim())) errores.push('nombre es obligatorio');
  if (typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errores.push('email no es válido');
  if (typeof data.contraseña !== 'string' || data.contraseña.length < 6) errores.push('contraseña debe tener al menos 6 caracteres');
  return errores;
}

// Valida los datos, evita emails repetidos y fuerza el rol de cuenta común.
exports.registro = async (req, res) => {
  const data = req.body || {};
  const errores = validarCredenciales(data, true);
  if (errores.length) return res.status(400).json({ message: 'Datos de registro inválidos', errores });

  // Verificamos si el email ya existe
  Usuario.findByEmail(data.email, async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Creamos el nuevo usuario
    Usuario.create({ ...data, rol: 'usuario' }, (err, results) => {
      if (err) return res.status(err.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ message: err.code === 'ER_DUP_ENTRY' ? 'El email ya está registrado' : 'No se pudo crear el usuario' });
      res.status(201).json({ id: results.insertId, nombre: data.nombre, email: data.email, rol: 'usuario' });
    });
  });
};

// Compara la contraseña con su versión protegida y entrega una sesión temporal.
exports.login = (req, res) => {
  const { email, contraseña } = req.body || {};
  if (typeof email !== 'string' || typeof contraseña !== 'string') {
    return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
  }

  // Buscar usuario por email
  Usuario.findByEmail(email, async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const usuario = results[0];

    // Comparar contraseña ingresada con la guardada en la base
    let match = false;
    try { match = await bcrypt.compare(contraseña, usuario.contraseña); } catch (_) { /* Rechaza contraseñas heredadas en texto plano. */ }
    if (!match) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      JWT_SECRET,
      { expiresIn: '1h' } // el token dura 1 hora
    );

    res.json({
      message: 'Login exitoso',
      token: token
    });
  });
};

// Obtener todos los usuarios (solo admin)
exports.getAll = (req, res) => {
  const db = require('../db');
  db.query('SELECT id, nombre, email, rol FROM usuarios', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Obtener un usuario por ID
exports.getById = (req, res) => {
  const id = req.params.id;
  const db = require('../db');
  db.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(results[0]);
  });
};

// Devuelve el perfil propio usando la identidad verificada del JWT.
exports.getMe = (req, res) => {
  req.params.id = req.user.id;
  exports.getById(req, res);
};

// Actualizar usuario
// Cada persona puede cambiar su propio perfil; solo un administrador puede cambiar roles.
exports.update = (req, res) => {
  const id = req.params.id;
  const data = req.body || {};
  const esAdmin = req.user.rol === 'admin';
  if (!esAdmin && String(req.user.id) !== String(id)) return res.status(403).json({ message: 'Solo puedes modificar tu propio perfil' });
  const camposPermitidos = esAdmin
    ? ['nombre', 'email', 'rol', 'foto']
    : ['nombre', 'email', 'foto', 'contraseña'];
  const cambios = Object.fromEntries(camposPermitidos.filter((campo) => data[campo] !== undefined).map((campo) => [campo, data[campo]]));
  if (!Object.keys(cambios).length) return res.status(400).json({ message: 'No hay campos de perfil válidos para actualizar' });
  if (cambios.nombre !== undefined && (typeof cambios.nombre !== 'string' || !cambios.nombre.trim())) return res.status(400).json({ message: 'nombre no es válido' });
  if (cambios.email !== undefined && (typeof cambios.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cambios.email))) return res.status(400).json({ message: 'email no es válido' });
  if (cambios.rol !== undefined && !['usuario', 'admin'].includes(cambios.rol)) return res.status(400).json({ message: 'rol no es válido' });
  if (cambios.contraseña !== undefined) {
    if (typeof cambios.contraseña !== 'string' || cambios.contraseña.length < 6) return res.status(400).json({ message: 'contraseña debe tener al menos 6 caracteres' });
    bcrypt.hash(cambios.contraseña, 10).then((hash) => {
      cambios.contraseña = hash;
      guardar();
    }).catch(() => res.status(500).json({ message: 'No se pudo actualizar la contraseña' }));
  } else guardar();

  // La misma función guarda los cambios con o sin una nueva contraseña.
  function guardar() {
    Usuario.update(id, cambios, (err, result) => {
      if (err) return res.status(err.code === 'ER_DUP_ENTRY' ? 409 : 500).json({ message: err.code === 'ER_DUP_ENTRY' ? 'El email ya está registrado' : 'No se pudo actualizar el usuario' });
      if (!result.affectedRows) return res.status(404).json({ message: 'Usuario no encontrado' });
      const { contraseña, ...publicData } = cambios;
      res.json({ id: Number(id), ...publicData });
    });
  }
};

// Eliminar usuario
exports.delete = (req, res) => {
  const id = req.params.id;
  const db = require('../db');
  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ message: 'No se pudo eliminar el usuario' });
    if (!result.affectedRows) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  });
};
