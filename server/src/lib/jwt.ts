import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "./env.js";
import type { JwtAccessPayload } from "../types/auth.js";

export function signAccessToken(payload: JwtAccessPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    // jsonwebtoken@9 types expect a template-literal StringValue; env gives string.
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  } satisfies SignOptions);
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtAccessPayload;
}

