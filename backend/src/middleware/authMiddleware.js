import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }
    
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format. Use 'Bearer <token>'." });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }
    
    req.user = decoded.userId;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired. Please login again." });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token. Please login again." });
    }
    
    res.status(401).json({ message: "Authentication failed" });
  }
};
