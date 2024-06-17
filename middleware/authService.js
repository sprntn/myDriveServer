const jwt = require("jsonwebtoken")
const secret = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token missing' });
    }

    const decoded = jwt.verify(token, secret) || null
    if(!decoded){
        return res.status(401).json({ message: 'invalid token' });
    }
    const email = decoded.email
    
    req.email = email
    
    next();
}

module.exports = verifyToken