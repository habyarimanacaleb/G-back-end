// isAdmin.js (middleware file)
const isAdmin = async (req, res, next) => {
    try {
      // Assuming the user's role is stored in the session
      const userRole = req.session?.userRole;  // This depends on how you're storing the user's role
  
      if (!userRole) {
        return res.status(401).json({ message: 'Role not found in session' });
      }
  
      if (userRole !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }
  
      next();  // Proceed to the next middleware or route handler
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };
  
  module.exports = isAdmin;
  