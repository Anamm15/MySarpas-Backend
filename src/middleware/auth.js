const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Middleware untuk autentikasi JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { idUser, role, ... }
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token' });
  }
};

// Middleware untuk otorisasi admin 
const authorizeAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { idUser: req.user.idUser },
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    next();
  } catch (err) {
    console.error('Authorization error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  authenticate,
  authorizeAdmin,
};
