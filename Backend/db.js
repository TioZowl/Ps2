const mysql = require('mysql2');
// Las credenciales pueden configurarse por entorno sin cambiar el código.
// Mantiene un grupo de conexiones reutilizables con MySQL.
const connection = mysql.createPool({
 host: process.env.DB_HOST || 'localhost',
 user: process.env.DB_USER || 'root',
 password: process.env.DB_PASSWORD || '',
 database: process.env.DB_NAME || 'Ps2',
 port: Number(process.env.DB_PORT || 3306),
 waitForConnections: true,
 connectionLimit: 10,
 queueLimit: 0
});

module.exports = connection;
