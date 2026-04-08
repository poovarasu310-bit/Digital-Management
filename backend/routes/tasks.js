const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');

const dataDir = path.join(__dirname, '../data');
const tasksFile = path.join(dataDir, 'tasks.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
if (!fs.existsSync(tasksFile)) {
  fs.writeFileSync(tasksFile, JSON.stringify([]));
}

let tasks = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));

const saveTasks = () => {
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
};

// GET /api/tasks
router.get('/', authenticate, (req, res) => {
  if (req.user.role === 'admin') {
    res.json(tasks);
  } else {
    res.json(tasks.filter(t => t.userId === req.user.id));
  }
});

// POST /api/tasks
router.post('/', authenticate, (req, res) => {
  const { title, description, status, githubLink } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });

  const newTask = {
    id: crypto.randomUUID(),
    title,
    description: description || '',
    status: status || 'pending',
    githubLink: githubLink || '',
    userId: req.user.id,
    createdAt: new Date()
  };
  tasks.push(newTask);
  saveTasks();
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id
router.put('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const { title, description, status, githubLink } = req.body;
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });

  if (tasks[taskIndex].userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const updatedTask = { ...tasks[taskIndex] };
  if (title !== undefined) updatedTask.title = title;
  if (description !== undefined) updatedTask.description = description;
  if (status !== undefined) updatedTask.status = status;
  if (githubLink !== undefined) updatedTask.githubLink = githubLink;

  tasks[taskIndex] = updatedTask;
  saveTasks();
  res.json(updatedTask);
});

// DELETE /api/tasks/:id
router.delete('/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) return res.status(404).json({ error: 'Task not found' });
  
  if (tasks[taskIndex].userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  tasks.splice(taskIndex, 1);
  saveTasks();
  res.json({ message: 'Task deleted successfully' });
});

module.exports = router;
