const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'Ps2Only-clave-de-desarrollo-cambiar';

// Middleware para verificar el token JWT
function verificarToken(req, res, next) {
  // El token suele venir en el header "Authorization"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  // Verificamos el token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    // Guardamos la info del usuario en la request para usarla después
    req.user = user;
    next(); // seguimos a la siguiente función
  });
}

module.exports = verificarToken;
