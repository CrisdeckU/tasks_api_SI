const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const app = express();

// Cargar la especificación OpenAPI desde un archivo YAML
const swaggerDocument = YAML.load('./docs/openapi.yaml');

// Middleware para servir la documentación de OpenAPI en /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoints de ejemplo
app.get('/tasks', (req, res) => {
  res.json([{ id: 1, title: "Revisar código", status: "en progreso" }]);
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
