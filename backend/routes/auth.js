const express = require('express');
const router = express.Router();
const supabase = require('../config/database');

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
        full_name: displayName
      }
    }
  });

  if (error) {
    return res.status(400).json({ error: error.message });
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

  res.status(200).json({ 
    message: 'Login successful', 
    user: data.user, 
    token: data.session?.access_token 
  });
});

// Get User
router.get('/user', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  
  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token or user not found' });
  }
  
  res.status(200).json({ user });
});

module.exports = router;
