import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'wvg_secret_key_2026';

export const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
};

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Token no proporcionado' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res
      .status(401)
      .json({ success: false, message: 'Token inválido o expirado' });
  }

  req.user = decoded;
  next();
};
