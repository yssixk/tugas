import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { getAllowedOrigins } from "./lib/env.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Postman / server-side requests
      if (!origin) return callback(null, true);

      const allowed = getAllowedOrigins();
      if (allowed.includes(origin)) return callback(null, true);

      // Vercel preview & production
      if (origin.endsWith(".vercel.app")) return callback(null, true);

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

