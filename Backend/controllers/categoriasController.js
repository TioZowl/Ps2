const Categoria = require('../models/categoriaModel');

// Solo se acepta un nombre no vacío para evitar categorías inutilizables.
function nombreValido(nombre) {
    return typeof nombre === 'string' && nombre.trim().length > 0 && nombre.trim().length <= 100;
}


// Obtener todas las categorías
// Las consultas de lectura alimentan el catálogo y el selector del administrador.
exports.getAll = (req, res) => {

    Categoria.getAll((err, results) => {

        if (err) {
            return res.status(500).json({ message: 'No se pudieron obtener las categorías' });
        }

        res.json(results);
    });

};


// Obtener categoría por ID
exports.getById = (req, res) => {

    const id = req.params.id;

    Categoria.getById(id, (err, results) => {

        if (err) {
            return res.status(500).json({ message: 'No se pudo obtener la categoría' });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: 'Categoría no encontrada'
            });
        }

        res.json(results[0]);
    });

};


// Crear categoría
// Evita categorías vacías y devuelve un mensaje entendible si el nombre ya existe.
exports.create = (req, res) => {

    const data = { nombre: req.body?.nombre?.trim() };
    if (!nombreValido(data.nombre)) return res.status(400).json({ message: 'nombre es obligatorio y debe tener hasta 100 caracteres' });

    Categoria.create(data, (err, results) => {

        if (err) {
            return res.status(err.code === 'ER_DUP_ENTRY' ? 409 : 500).json({
                message: err.code === 'ER_DUP_ENTRY' ? 'Ya existe una categoría con ese nombre' : 'No se pudo crear la categoría'
            });
        }

        res.status(201).json({
            id: results.insertId,
            ...data
        });

    });

};


// Actualizar categoría
exports.update = (req, res) => {

    const id = req.params.id;
    const data = { nombre: req.body?.nombre?.trim() };
    if (!nombreValido(data.nombre)) return res.status(400).json({ message: 'nombre es obligatorio y debe tener hasta 100 caracteres' });

    Categoria.update(id, data, (err, result) => {

        if (err) {
            return res.status(err.code === 'ER_DUP_ENTRY' ? 409 : 500).json({
                message: err.code === 'ER_DUP_ENTRY' ? 'Ya existe una categoría con ese nombre' : 'No se pudo actualizar la categoría'
            });
        }

        if (!result.affectedRows) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({
            id,
            ...data
        });

    });

};


// Eliminar categoría
// La base impide borrar una categoría que todavía tiene productos asociados.
exports.delete = (req, res) => {

    const id = req.params.id;

    Categoria.delete(id, (err, result) => {

        if (err) {
            const categoriaEnUso = err.code === 'ER_ROW_IS_REFERENCED_2';
            return res.status(categoriaEnUso ? 409 : 500).json({
                message: categoriaEnUso ? 'No se puede eliminar una categoría que tiene productos asociados' : 'No se pudo eliminar la categoría'
            });
        }

        if (!result.affectedRows) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json({
            message: 'Categoría eliminada'
        });

    });

};
