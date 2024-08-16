const express = require('express');
const authenticateJWT = require('../middleware/authenticateJWT');
const authorizeRole = require('../middleware/authorized');
const {
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
} = require('../controllers/user');

const router = express.Router();

// Get all users (Admin only)
router.get('/all', [authenticateJWT, authorizeRole(['admin'])], getAllUsers);

// Get details of the logged-in user
router.get('/detail', authenticateJWT, getUserDetails);

// Update a user
router.put('/:id/update', authenticateJWT, updateUser);

// Delete a user (Admin only)
router.delete('/:id/delete', [authenticateJWT, authorizeRole(['admin'])], deleteUser);

module.exports = router;
