const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const taskController = require('../controllers/taskController');

router.get('/', authMiddleware, taskController.getTasks);
router.post('/', authMiddleware, taskController.createTask);
router.put('/:id', authMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);

module.exports = router;