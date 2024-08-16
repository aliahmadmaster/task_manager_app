const User = require('../models/user');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1; 
  const offset = (page - 1) * limit;

  try {
    const users = await User.getAllUsers(limit, offset);
    const totalUsers = await User.countUsers();
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      users,
      totalUsers,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
};

// Get user details for logged-in user
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  const { id } = req.params;

  try {
    const updated = await User.updateUser(id, name, email, password);
    if (updated === 0) {
      return res.status(404).json({ message: 'User not found or no changes made' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
};

// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await User.deleteUser(id);
    if (deleted === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
};
