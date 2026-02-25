const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log("🔐 Token found, verifying...");
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token verified, user ID:", decoded.id);
      
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        console.log("❌ User not found in database");
        return res.status(401).json({ message: 'User not found' });
      }
      
      console.log("✅ User loaded:", req.user.name, "Role:", req.user.role);
      return next(); // Add return here
      
    } catch (error) {
      console.error("❌ Token verification failed:", error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // If no token found
  console.log("❌ No token provided");
  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    console.log("🔒 Checking authorization - User role:", req.user?.role, "Required roles:", roles);
    
    if (!req.user) {
      console.log("❌ req.user is null");
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      console.log("❌ User role not authorized");
      return res.status(403).json({ 
        message: `Role (${req.user.role}) is not allowed to access this resource` 
      });
    }
    
    console.log("✅ Authorization granted");
    next();
  };
};

module.exports = { protect, authorize };