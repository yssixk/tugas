import { z } from "zod";
import { asyncHandler } from "../lib/asyncHandler.js";
import { ApiError } from "../lib/ApiError.js";
import { env } from "../lib/env.js";
import { getUserPublicById, updateUserProfile } from "../services/user.service.js";
import { uploadPublicFile } from "../services/storage.service.js";

const patchSchema = z.object({
  full_name: z.string().min(3).optional(),
  address: z.string().min(5).optional(),
});

export const getMe = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const me = await getUserPublicById(req.auth.userId);
  res.json({ me });
});

export const patchMe = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const body = patchSchema.parse(req.body);
  const me = await updateUserProfile(req.auth.userId, body);
  res.json({ me });
});

export const uploadAvatar = asyncHandler(async (req, res) => {
  if (!req.auth) throw new ApiError(401, "Unauthorized");
  const file = req.file;
  if (!file) throw new ApiError(400, "File avatar wajib diupload");

  const ext = (file.originalname.split(".").pop() ?? "png").toLowerCase();
  const url = await uploadPublicFile({
    bucket: env.SUPABASE_AVATAR_BUCKET,
    folder: `user-${req.auth.userId}`,
    fileBuffer: file.buffer,
    contentType: file.mimetype,
    fileExt: ext,
  });

  const me = await updateUserProfile(req.auth.userId, { avatar_url: url });
  res.json({ me });
});

