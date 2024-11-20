require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuración de CORS
app.use(
  cors({
    origin: "*",
  })
);

// Habilitar JSON en el cuerpo de las solicitudes (Mover arriba)
app.use(express.json());

// Cargar las rutas de la API
const routes = require('./routes');

// Cargar la especificación OpenAPI desde el archivo YAML
const swaggerDocument = YAML.load('../api-documentation/docs/openapi.yaml');

// Configuración de SQL Server
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
  .then((pool) => {
    if (pool.connected) console.log('Conexión exitosa a SQL Server');
  })
  .catch((err) => console.error('Error en la conexión a SQL Server:', err));

// Middleware para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para las rutas de la API
app.use('/v1', routes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
