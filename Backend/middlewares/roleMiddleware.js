// Middleware para verificar si el usuario es administrador
// Se ejecuta después de verificar la sesión y reserva la acción a administradores.
function verificarAdmin(req, res, next) {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado: se requiere rol administrador' });
  }
  next();
}

module.exports = verificarAdmin;