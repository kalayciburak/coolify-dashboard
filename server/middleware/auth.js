import authService from "../services/authService.js";
import { AppError } from "../utils/errorHandler.js";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("Token bulunamadı", 401);
    }

    const decoded = authService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(error.statusCode || 401).json({
      message: error.message || "Geçersiz token",
    });
  }
};
