// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send({ error: 'Invalid token' });
  }
};

const authorizeAdmin = (req, res, next) => { //INI PAKE PRISMA
  console.log(req.user)
//   if (req.user.role !== 'admin') {  
//     return res.status(403).send({ error: 'Admin access required' });
//   }
  next();
};

module.exports = {
    authenticate,
    authorizeAdmin
  };