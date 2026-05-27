import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ApiError } from "../lib/ApiError.js";
import { signAccessToken } from "../lib/jwt.js";
import { createUser, findUserByEmailOrUsername, verifyPassword } from "../services/user.service.js";

const registerSchema = z
  .object({
    fullName: z.string().min(3),
    username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Konfirmasi password tidak sama",
  });

const loginSchema = z.object({
  identifier: z.string().min(3), // email atau username
  password: z.string().min(1),
});

export const register = asyncHandler(async (req, res) => {
  const body = registerSchema.parse(req.body);
  const user = await createUser({
    full_name: body.fullName,
    username: body.username,
    email: body.email,
    password: body.password,
    role: "user",
  });

  res.status(201).json({
    message: "Registrasi berhasil",
    user: { id: user.id, full_name: user.full_name, username: user.username, email: user.email, role: user.role },
  });
});

export const login = asyncHandler(async (req, res) => {
  const body = loginSchema.parse(req.body);
  const user = await findUserByEmailOrUsername(body.identifier);
  if (!user) throw new ApiError(401, "Login gagal. Email/username atau password salah.");

  const ok = await verifyPassword(user, body.password);
  if (!ok) throw new ApiError(401, "Login gagal. Email/username atau password salah.");

  const token = signAccessToken({ sub: user.id, role: user.role });
  res.json({
    token,
    user: { id: user.id, full_name: user.full_name, username: user.username, email: user.email, role: user.role },
  });
});

export const adminLogin = asyncHandler(async (req, res) => {
  const body = loginSchema.parse(req.body);
  const user = await findUserByEmailOrUsername(body.identifier);
  if (!user) throw new ApiError(401, "Login admin gagal");
  if (user.role !== "admin") throw new ApiError(403, "Akun ini bukan admin");

  const ok = await verifyPassword(user, body.password);
  if (!ok) throw new ApiError(401, "Login admin gagal");

  const token = signAccessToken({ sub: user.id, role: user.role });
  res.json({
    token,
    user: { id: user.id, full_name: user.full_name, username: user.username, email: user.email, role: user.role },
  });
});

