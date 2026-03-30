const express = require('express');
const router = express.Router();
const supabase = require('../config/database');
const { authenticate, checkRole } = require('../middleware/authMiddleware');

let localUsers = [];

// Register test route for browser testing
router.get('/register', (req, res) => {
  res.send('Register API working ✅');
});

// Register
router.post('/register', async (req, res) => {
  const { email, password, fullName, name } = req.body;
  const displayName = fullName || name;
  
  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'Please provide email, password, and name.' });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: displayName,
        role: 'user'
      }
    }
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (data.user) {
    localUsers.push({ id: data.user.id, email: data.user.email, role: 'user', name: displayName });
  }

  res.status(201).json({ 
    message: 'Registration successful', 
    user: data.user,
    token: data.session?.access_token 
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  if (data.user && !localUsers.find(u => u.id === data.user.id)) {
    localUsers.push({ 
      id: data.user.id, 
      email: data.user.email, 
      role: data.user.user_metadata?.role || 'user',
      name: data.user.user_metadata?.full_name || ''
    });
  }

  res.status(200).json({ 
    message: 'Login successful', 
    user: data.user, 
    token: data.session?.access_token 
  });
});

// Get User
router.get('/user', authenticate, (req, res) => {
  res.status(200).json({ user: req.user });
});

// Admin: Get all users
router.get('/users', authenticate, checkRole('admin'), (req, res) => {
  res.status(200).json(localUsers);
});

module.exports = router;
