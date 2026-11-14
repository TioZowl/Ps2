const db = require('../db');

// Reúne las consultas de categorías para que el controlador no dependa del SQL.
const Categoria = {

    // Obtener todas las categorías
    getAll: (callback) => {
        db.query(
            'SELECT * FROM categorias',
            callback
        );
    },

    // Obtener una categoría por ID
    getById: (id, callback) => {
        db.query(
            'SELECT * FROM categorias WHERE id = ?',
            [id],
            callback
        );
    },

    // Crear categoría
    create: (data, callback) => {
        db.query(
            'INSERT INTO categorias SET ?',
            data,
            callback
        );
    },

    // Modificar categoría
    update: (id, data, callback) => {
        db.query(
            'UPDATE categorias SET ? WHERE id = ?',
            [data, id],
            callback
        );
    },

    // Eliminar categoría
    delete: (id, callback) => {
        db.query(
            'DELETE FROM categorias WHERE id = ?',
            [id],
            callback
        );
    }
};

module.exports = Categoria;