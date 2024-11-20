const express = require('express');
const router = express.Router();
const tasks = require('./routes/tasks');


router.use('/tasks', tasks);  

module.exports = router;
