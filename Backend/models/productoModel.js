const db = require('../db');

// Reúne las consultas de productos; el controlador decide cuándo se pueden usar.
const Producto = {
  getAll: (callback) => {
    db.query('SELECT * FROM productos', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM productos WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    db.query('INSERT INTO productos SET ?', data, callback);
  },
  
  update: (id, data, callback) => {
    db.query('UPDATE productos SET ? WHERE id = ?', [data, id], callback);
  },
  
  delete: (id, callback) => {
    db.query('DELETE FROM productos WHERE id = ?', [id], callback);
  }
};

module.exports = Producto;
