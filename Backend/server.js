const express = require('express');
const cors = require('cors');
const path = require('node:path');
const app = express();
const productosRoutes = require('./Routes/productosRoutes');
const usuariosRoutes = require('./Routes/usuariosRoutes');
const categoriasRoutes = require('./Routes/categoriasRoutes');


// Permite que el frontend separado consuma la API y procesa cuerpos JSON.
app.use(cors());
app.use(express.json());

// Un error de sintaxis JSON debe responderse como 400, no como error interno.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'El cuerpo JSON no es válido' });
  }
  next(err);
});

// El mismo servidor publica HTML, CSS y JavaScript para usar la tienda desde el navegador.
app.use(express.static(path.join(__dirname, '..', 'Frontend')));

app.use('/productos', productosRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/categorias', categoriasRoutes);

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}

module.exports = app;
