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
  const { email, password, fullName, name, role } = req.body;
  const displayName = fullName || name;
  const userRole = role === 'admin' ? 'admin' : 'user';
  
  if (!email || !password || !displayName) {
    return res.status(400).json({ error: 'Please provide email, password, and name.' });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: displayName,
        role: userRole
      }
    }
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  if (data.user) {
    localUsers.push({ id: data.user.id, email: data.user.email, role: userRole, name: displayName });
  }

  res.status(201).json({ 
    message: 'Registration successful', 
    user: {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role || 'user'
    },
    token: data.session?.access_token 
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  // Developer Bypass for testing specific admin email
  if (email === 'poovarasuvelu310@gmail.com' || email === 'poovarasu310@gmail.com') {
    const devUser = {
      id: 'dev-admin-id-123',
      email: email,
      role: 'admin',
      name: 'Admin Poovarasu'
    };
    
    if (!localUsers.find(u => u.id === devUser.id)) {
      localUsers.push(devUser);
    }
    
    return res.status(200).json({ 
      message: 'Login successful', 
      user: devUser, 
      token: 'dev-admin-token-12345' 
    });
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
    user: {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata?.role || 'user'
    }, 
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

// Admin: Delete user
router.delete('/users/:id', authenticate, checkRole('admin'), (req, res) => {
  const { id } = req.params;
  const userIndex = localUsers.findIndex(u => u.id === id);
  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });
  
  localUsers.splice(userIndex, 1);
  res.json({ message: 'User deleted successfully' });
});

module.exports = router;
