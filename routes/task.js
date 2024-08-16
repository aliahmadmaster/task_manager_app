const express = require('express');
const { 
  createTask, 
  updateTask, 
  getAllTasks, 
  deleteTask, 
  getTasksByUser, 
  updateTaskStatus, 
  searchTasks, 
  filterTasks 
} = require('../controllers/task');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRole = require('../middleware/authorized');

const router = express.Router();

// Create a new task
router.post('/', authenticateJWT, createTask);

// Update an existing task
router.put('/:id', authenticateJWT, updateTask);

// Admin-only route to get all tasks
router.get('/all', [authenticateJWT, authorizeRole(['admin'])], getAllTasks);

// Delete a task
router.delete('/:id', authenticateJWT, deleteTask);

// Get paginated and sorted tasks for the logged-in user
router.get('/', authenticateJWT, getTasksByUser);

// Update task status
router.put('/:id/status', authenticateJWT, updateTaskStatus);

// Search tasks by title or description
router.get('/search', authenticateJWT, searchTasks);

// Filter tasks based on status, user, title, etc.
router.get('/filter', authenticateJWT, filterTasks);

module.exports = router;
