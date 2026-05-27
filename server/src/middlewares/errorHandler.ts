import type { ErrorRequestHandler } from "express";
import { ApiError } from "../lib/ApiError.js";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validasi gagal",
      errors: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, code: err.code });
  }

  // eslint-disable-next-line no-console
  console.error(err);
  return res.status(500).json({ message: "Terjadi kesalahan server" });
};

