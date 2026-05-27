import type { RequestHandler } from "express";
import { ApiError } from "../lib/ApiError.js";
import { verifyAccessToken } from "../lib/jwt.js";
import type { Role } from "../types/auth.js";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.header("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return next(new ApiError(401, "Unauthorized"));

  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.sub, role: payload.role };
    return next();
  } catch {
    return next(new ApiError(401, "Token tidak valid / expired"));
  }
};

export function requireRole(roles: Role[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) return next(new ApiError(401, "Unauthorized"));
    if (!roles.includes(req.auth.role)) return next(new ApiError(403, "Forbidden"));
    return next();
  };
}

