
const db = require('../db');
const bcrypt = require('bcrypt');

// El alta siempre guarda hash bcrypt; el registro público fuerza el rol usuario.
// Reúne las consultas de usuarios y protege la contraseña antes de guardarla.
const user = {
  create: async (data, callback) => {
    try {
      const hashedPassword = await bcrypt.hash(data.contraseña, 10);

      const usuarioData = {
        nombre: data.nombre,
        email: data.email,
        contraseña: hashedPassword,
        rol: 'usuario',
        foto: data.foto || null
      };

      db.query(
        'INSERT INTO usuarios SET ?',
        usuarioData,
        callback
      );
    } catch (error) {
      callback(error);
    }
  },

  findByEmail: (email, callback) => {
    db.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email],
      callback
    );
  },
  update: (id, data, callback) => {
    db.query('UPDATE usuarios SET ? WHERE id = ?', [data, id], callback);
  }
};

module.exports = user;
