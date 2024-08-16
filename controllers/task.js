const Task = require('../models/task');
const { validateTask, validateTaskQuery, validatefilterTaskQuery } = require('../validators/taskValidator');

// Create a new task
exports.createTask = async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    let { title, description, status } = req.body;
    
    const userId = req.user.id;
    const taskId = await Task.createTask(title, description, status, userId);

    res.status(201).json({ message: "Task created successfully", taskId });
    
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Update an existing task
exports.updateTask = async (req, res) => {
  const { error } = validateTask(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { title, description, status } = req.body;
    const taskId = req.params.id;
    const changes = await Task.updateTask(taskId, title, description, status, req.user.id);
    if (changes === 0) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task updated successfully', task: changes });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
};

// Get all tasks (Admin only)
exports.getAllTasks = async (req, res) => {
  const { error } = validateTaskQuery(req.query);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { limit = 10, page = 1, sortField = 'id', sortOrder } = req.query;
    const offset = (page - 1) * limit;
    const tasks = await Task.getAllTasks(limit, offset, sortField, sortOrder);  
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const changes = await Task.deleteTask(taskId, req.user.id, req.user.role);
    if (changes === 0) return res.status(404).json({ message: 'Task not found' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};

// Get tasks for the logged-in user
exports.getTasksByUser = async (req, res) => {
  const { error } = validateTaskQuery(req.query);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const { limit = 10, page = 1, sortField, sortOrder } = req.query;
    const offset = (page - 1) * limit;
    
    const tasks = await Task.getTasksByUserId(req.user.id, limit, offset, sortField, sortOrder);
    const totalTasks = await Task.getTaskCountByUserId(req.user.id);
    
    res.json({
      tasks: tasks,
      totalTasks: totalTasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  const taskId = req.params.id;
  const { status } = req.body;

  // Valid statuses
  const validStatuses = ['ToDo', 'InProgress', 'Done'];

  // Check if status is valid
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  
  try {
    const changes = await Task.updateTaskStatus(taskId, status);

    if (changes > 0) {
      res.status(200).json({ message: 'Task status updated successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Error updating task status', error: error.message });
  }
};

// Search tasks
exports.searchTasks = async (req, res) => {
  const userId = req.user.id;
  const { searchTerm } = req.query;

  if (!searchTerm) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  try {
    const tasks = await Task.searchTasks(userId, searchTerm);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error searching tasks', error: error.message });
  }
};

// Filter tasks
exports.filterTasks = async (req, res) => {
  const { error } = validatefilterTaskQuery(req.query);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const filters = {
      status: req.query.status,
      userId: req.query.userId,
      title: req.query.title,
      description: req.query.description,
      limit: req.query.limit,
      offset: (req.query.page - 1) * req.query.limit,
    };

    const tasks = await Task.filterTasks(filters);

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};
