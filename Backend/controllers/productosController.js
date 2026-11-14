const Producto = require('../models/productoModel');
const Categoria = require('../models/categoriaModel');

// Los campos permitidos son explícitos para evitar guardar propiedades ajenas al modelo.
// Revisa los campos del producto antes de consultar o modificar la base de datos.
function validarProducto(data) {
  const errores = [];
  const precioValido = data.precio !== null && data.precio !== '' && Number.isFinite(Number(data.precio));
  const stockValido = data.stock !== null && data.stock !== '' && Number.isInteger(Number(data.stock));
  if (typeof data.nombre !== 'string' || !data.nombre.trim()) errores.push('nombre es obligatorio');
  if (typeof data.descripcion !== 'string' || !data.descripcion.trim()) errores.push('descripcion es obligatoria');
  if (!precioValido || Number(data.precio) < 0) errores.push('precio debe ser un número mayor o igual a 0');
  if (!stockValido || Number(data.stock) < 0) errores.push('stock debe ser un entero mayor o igual a 0');
  if (!Number.isInteger(Number(data.id_categoria)) || Number(data.id_categoria) < 1) errores.push('id_categoria debe ser un entero positivo');
  if (typeof data.imagen !== 'string' || !data.imagen.trim()) errores.push('imagen es obligatoria');
  return errores;
}

const camposPermitidos = ['nombre', 'descripcion', 'precio', 'stock', 'id_categoria', 'imagen'];
// Conserva solo los campos que este sistema permite guardar para un producto.
function camposProducto(data) {
  return Object.fromEntries(camposPermitidos.filter((campo) => data[campo] !== undefined).map((campo) => [campo, data[campo]]));
}

exports.getAll = (req, res) => {
  Producto.getAll((err, results) => {
    if (err) return res.status(500).json({ message: 'No se pudieron obtener los productos' });
    res.json(results);
  });
};

exports.getById = (req, res) => {
  const id = req.params.id;
  Producto.getById(id, (err, results) => {
    if (err) return res.status(500).json({ message: 'No se pudo obtener el producto' });
    if (!results.length) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(results[0]);
  });
};

// Antes de crear, comprueba también que la categoría elegida exista.
exports.create = (req, res) => {
  const data = camposProducto(req.body || {});
  const errores = validarProducto(data);
  if (errores.length) return res.status(400).json({ message: 'Datos de producto inválidos', errores });
  Categoria.getById(data.id_categoria, (categoriaError, categorias) => {
    if (categoriaError) return res.status(500).json({ message: 'No se pudo validar la categoría' });
    if (!categorias.length) return res.status(400).json({ message: 'La categoría indicada no existe' });
    Producto.create(data, (err, results) => {
      if (err) return res.status(500).json({ message: 'No se pudo crear el producto' });
      res.status(201).json({ id: results.insertId, ...data });
    });
  });
};

// Completa los campos omitidos con los valores actuales para validar el producto final.
exports.update = (req, res) => {
  const id = req.params.id;
  const data = camposProducto(req.body || {});
  if (!Object.keys(data).length) return res.status(400).json({ message: 'Debe enviar al menos un campo para actualizar' });
  Producto.getById(id, (findError, products) => {
    if (findError) return res.status(500).json({ message: 'No se pudo consultar el producto' });
    if (!products.length) return res.status(404).json({ message: 'Producto no encontrado' });
    const merged = { ...products[0], ...data };
    const errores = validarProducto(merged);
    if (errores.length) return res.status(400).json({ message: 'Datos de producto inválidos', errores });
    const guardar = () => Producto.update(id, data, (err) => {
      if (err) return res.status(500).json({ message: 'No se pudo actualizar el producto' });
      res.json({ ...merged, id: Number(id) });
    });
    if (data.id_categoria === undefined) return guardar();
    Categoria.getById(data.id_categoria, (categoryError, categories) => {
      if (categoryError) return res.status(500).json({ message: 'No se pudo validar la categoría' });
      if (!categories.length) return res.status(400).json({ message: 'La categoría indicada no existe' });
      guardar();
    });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;
  Producto.delete(id, (err, results) => {
    if (err) return res.status(500).json({ message: 'No se pudo eliminar el producto' });
    if (!results.affectedRows) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  });
};
