import { randomUUID } from "node:crypto";
import { supabaseAdmin } from "../lib/supa.js";
import { ApiError } from "../lib/ApiError.js";

export async function uploadPublicFile(input: {
  bucket: string;
  folder: string;
  fileBuffer: Buffer;
  contentType: string;
  fileExt: string;
}) {
  const name = `${input.folder}/${randomUUID()}.${input.fileExt}`;

  const { error: uploadError } = await supabaseAdmin.storage.from(input.bucket).upload(name, input.fileBuffer, {
    contentType: input.contentType,
    upsert: true,
  });
  if (uploadError) throw new ApiError(500, "Gagal upload file", "STORAGE_UPLOAD");

  const { data } = supabaseAdmin.storage.from(input.bucket).getPublicUrl(name);
  return data.publicUrl;
}

