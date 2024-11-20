const express = require('express');
const { body, param, validationResult } = require('express-validator');
const router = express.Router();
const sql = require('mssql');

// Middleware para manejar errores de validación
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect();
    const result = await pool.request().query('SELECT * FROM Tasks');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener tareas:', err);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  }
});

// Obtener una tarea por ID
router.get(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
  validateRequest,
  async (req, res) => {
    const { id } = req.params;

    try {
      const pool = await sql.connect();
      const result = await pool.request().input('id', sql.Int, id).query('SELECT * FROM Tasks WHERE id = @id');

      if (result.recordset.length === 0) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      res.json(result.recordset[0]);
    } catch (err) {
      console.error('Error al obtener tarea por ID:', err);
      res.status(500).json({ error: 'Error al obtener la tarea' });
    }
  }
);

// Obtener tareas por estado
router.get(
  '/status/:status',
  param('status')
    .isIn(['pendiente', 'en progreso', 'completada'])
    .withMessage('El estado debe ser uno de: pendiente, en progreso, completada'),
  validateRequest,
  async (req, res) => {
    const { status } = req.params;

    try {
      const pool = await sql.connect();
      const result = await pool.request().input('status', sql.NVarChar, status).query('SELECT * FROM Tasks WHERE status = @status');
      res.json(result.recordset);
    } catch (err) {
      console.error('Error al obtener tareas por estado:', err);
      res.status(500).json({ error: 'Error al obtener las tareas' });
    }
  }
);

// Crear una nueva tarea
router.post(
  '/',
  [
    body('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    body('title').isString().notEmpty().withMessage('El título es obligatorio'),
    body('description').isString().optional(),
    body('status')
      .isIn(['pendiente', 'en progreso', 'completada'])
      .withMessage('El estado debe ser uno de: pendiente, en progreso, completada'),
  ],
  validateRequest,
  async (req, res) => {
    const { id, title, description, status } = req.body;

    try {
      const pool = await sql.connect();
      await pool.request()
        .input('id', sql.Int, id)
        .input('title', sql.NVarChar, title)
        .input('description', sql.NVarChar, description)
        .input('status', sql.NVarChar, status)
        .query('INSERT INTO Tasks (id, title, description, status) VALUES (@id, @title, @description, @status)');
      res.status(201).json({ message: 'Tarea creada exitosamente' });
    } catch (err) {
      console.error('Error al crear tarea:', err);
      res.status(500).json({ error: 'Error al crear la tarea' });
    }
  }
);

// Actualizar una tarea por ID
router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    body('title').isString().optional(),
    body('description').isString().optional(),
    body('status')
      .isIn(['pendiente', 'en progreso', 'completada'])
      .optional()
      .withMessage('El estado debe ser uno de: pendiente, en progreso, completada'),
  ],
  validateRequest,
  async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
      const pool = await sql.connect();
      await pool.request()
        .input('id', sql.Int, id)
        .input('title', sql.NVarChar, title)
        .input('description', sql.NVarChar, description)
        .input('status', sql.NVarChar, status)
        .query('UPDATE Tasks SET title = @title, description = @description, status = @status WHERE id = @id');
      res.json({ message: 'Tarea actualizada exitosamente' });
    } catch (err) {
      console.error('Error al actualizar tarea:', err);
      res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
  }
);

// Eliminar una tarea por ID
router.delete(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
  validateRequest,
  async (req, res) => {
    const { id } = req.params;

    try {
      const pool = await sql.connect();
      const result = await pool
        .request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Tasks WHERE id = @id');

      // Verificar si se afectaron filas
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      res.status(200).json({ message: 'Tarea eliminada exitosamente' });
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
      res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
  }
);


// Actualizar parcialmente una tarea por ID
router.patch(
  '/:id',
  [
    // Validar el ID en el parámetro
    param('id').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),

    // Validar campos opcionales en el cuerpo de la solicitud
    body('title')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('El título debe ser un texto no vacío'),
    body('description')
      .optional()
      .isString()
      .withMessage('La descripción debe ser un texto'),
    body('status')
      .optional()
      .isIn(['pendiente', 'en progreso', 'completada'])
      .withMessage('El estado debe ser uno de: pendiente, en progreso, completada'),
  ],
  validateRequest,
  async (req, res) => {
    const { id } = req.params;
    const updates = req.body; // Los campos que se quieren actualizar

    try {
      const pool = await sql.connect();

      // Verificar que al menos un campo fue enviado
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'Debe enviar al menos un campo para actualizar' });
      }

      // Construir dinámicamente el query con solo los campos enviados en el body
      let query = 'UPDATE Tasks SET ';
      const queryParams = [];
      Object.keys(updates).forEach((key, index) => {
        query += `${key} = @param${index}, `;
        queryParams.push({ name: `param${index}`, value: updates[key], type: sql.NVarChar });
      });
      query = query.slice(0, -2); // Remover la última coma y espacio
      query += ' WHERE id = @id';

      // Agregar el parámetro ID
      queryParams.push({ name: 'id', value: id, type: sql.Int });

      // Preparar y ejecutar la consulta
      const request = pool.request();
      queryParams.forEach(param => {
        request.input(param.name, param.type, param.value);
      });

      const result = await request.query(query);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }

      res.json({ message: 'Tarea actualizada parcialmente' });
    } catch (err) {
      console.error('Error al actualizar parcialmente la tarea:', err);
      res.status(500).json({ error: 'Error al actualizar parcialmente la tarea' });
    }
  }
);


module.exports = router;
