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
      emailRedirectTo: "http://localhost:3000/login",
      data: {
        full_name: displayName,
        role: userRole
      }
    }
  });

  // Handle the common "Email confirmation not sent" error as a success 
  // because the account IS created in Supabase Auth, just pending verification.
  const isEmailError = error?.message?.toLowerCase().includes('sending confirmation') || 
                      error?.message?.toLowerCase().includes('confirmation url');

  if (error && !isEmailError) {
    return res.status(400).json({ error: error.message });
  }

  const user = data.user || { id: `temp-${Date.now()}`, email, user_metadata: { full_name: displayName, role: userRole } };

  // Always insert into our local listing for quick access/bypass
  const newUser = { 
    id: user.id, 
    email: email, 
    role: userRole, 
    name: displayName,
    password: password // For local bypass if needed
  };
  
  if (!localUsers.find(u => u.email === email)) {
    localUsers.push(newUser);
  }

  // Also try to insert into users table if it exists
  if (data.user) {
    try {
      await supabase.from("users").upsert({
        id: data.user.id,
        email: email,
        role: userRole,
        full_name: displayName
      });
    } catch (e) {
      console.warn("Table 'users' might not exist or insert failed:", e.message);
    }
  }

  res.status(201).json({ 
    message: isEmailError ? 'Account created! (Verification email skipped for development)' : 'Account created successfully!', 
    user: {
      id: user.id,
      email: email,
      role: userRole
    }
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password.' });
  }

  // Check if credentials are valid via Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  // Fetch user role from database using user ID
  let role = null;
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();
      
    if (userData && userData.role) {
      role = userData.role;
    }
  } catch (err) {
    console.error("Error fetching user role:", err);
  }

  // If role is missing in database, check user_metadata as fallback
  if (!role) {
    role = data.user.user_metadata?.role;
  }

  if (!role) {
    return res.status(403).json({ error: 'User role not assigned' });
  }

  res.status(200).json({ 
    message: 'Login successful', 
    user: {
      id: data.user.id,
      email: data.user.email,
      role: role
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
