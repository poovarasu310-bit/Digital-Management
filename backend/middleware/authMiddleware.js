const supabase = require('../config/database');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  
  // Developer token bypass
  if (token === 'dev-admin-token-12345') {
    // For simplicity we use the newer email but since token is generic it works as admin.
    req.user = { id: 'dev-admin-id-123', email: 'admin123@gmail.com', role: 'admin' };
    return next();
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  req.user = {
    id: user.id,
    email: user.email,
    role: user.user_metadata?.role || 'user'
  };
  next();
};

const checkRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { authenticate, checkRole };
