import jwt from "jsonwebtoken";
import { prisma } from "../config/budgetDB.js";

export const authMiddleware = async (req, res, next) => {
  try {
    
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        error: "Not authorized, no token",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED:", decoded);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    console.log("USER FROM TOKEN:", user);

    if (!user) {
      return res.status(401).json({
        error: "Not authorized, user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
  console.error("AUTH ERROR:", error.message);
  return res.status(401).json({
    error: error.message,
  });
  }
};