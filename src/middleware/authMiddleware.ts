import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define possible roles
type Role = "Guest" | "Member" | "Consultant" | "Admin";

// Middleware factory for role-based authorization
const authorizeRoles = (allowedRoles: Role[]) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // If guest is allowed, continue without token
    if (allowedRoles.includes("Guest")) {
      return next();
    }
    console.log("No token provided");
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return res.sendStatus(403);
    }

    // Attach user to req
    (req as any).user = decoded;

    // Check user role
    const userRole = (decoded as any).role as Role;
    if (!allowedRoles.includes(userRole)) {
      return res.sendStatus(403);
    }

    next();
  });
};

export default authorizeRoles;