const Joi = require('joi');

// Task creation and update validation schema
const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(5).max(500).required(),
  status: Joi.string().valid('ToDo', 'InProgress', 'Done').required()
});

// Pagination and sorting schema for task list queries
const taskQuerySchema = Joi.object({
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1),
  sortField: Joi.string().valid('id', 'title', 'status').default('id'),
  sortOrder: Joi.string().valid('ASC', 'DESC').default('ASC')
});

const taskFilterSchema = Joi.object({
  status: Joi.string().valid('ToDo', 'InProgress', 'Done').optional(),
  userId: Joi.number().integer().positive().optional(),
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  limit: Joi.number().integer().positive().optional(),
  page: Joi.number().integer().min(1).default(1),
});
module.exports = {
  validateTask: (data) => taskSchema.validate(data),
  validateTaskQuery: (query) => taskQuerySchema.validate(query),
  validatefilterTaskQuery: (query) => taskFilterSchema.validate(query),

};
