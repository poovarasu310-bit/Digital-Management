const express = require('express');
const crypto = require('crypto');
const router = express.Router();

let tasks = [];

// GET /api/tasks
router.get('/', (req, res) => {
  res.json(tasks);
});

// POST /api/tasks
router.post('/', (req, res) => {
  const { title, description, status } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const newTask = {
    id: crypto.randomUUID(),
    title,
    description: description || '',
    status: status || 'pending'
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

  const updatedTask = { ...tasks[taskIndex] };
  if (title !== undefined) updatedTask.title = title;
  if (description !== undefined) updatedTask.description = description;
  if (status !== undefined) updatedTask.status = status;

  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  if (tasks.length === initialLength) return res.status(404).json({ error: 'Task not found' });
  
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;
