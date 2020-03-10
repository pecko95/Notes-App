import jwt from "jsonwebtoken";
import env from "../config/index";

// Generate access tokens
export const generateAccessToken = (user) => {
  return jwt.sign(user, env.JWT_ACCESS_SECRET, { expiresIn: '5m' });
};

// Generate refresh tokens
export const generateRefreshToken = (user) => {
  return jwt.sign(user, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};