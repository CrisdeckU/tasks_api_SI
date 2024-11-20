require('dotenv').config();
const express = require('express');
const sql = require('mssql');



const app = express();
const port = 3000;
const cors = require ("cors")
app.use(
  cors({
    origin:"*"
  })
)

const routes = require('./routes');

// Configuración de SQL Server (igual que antes)
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Conexión a la base de datos
sql.connect(dbConfig)
  .then(pool => {
    if (pool.connected) console.log('Conexión exitosa a SQL Server');
  })
  .catch(err => console.error('Error en la conexión a SQL Server:', err));

app.use(express.json());
app.use('/', routes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

app.listen(3000, '0.0.0.0', () => {
  console.log('Servidor escuchando en el puerto 3000');
});

