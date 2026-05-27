import bcrypt from "bcryptjs";
import { supabaseAdmin } from "../lib/supa.js";
import { ApiError } from "../lib/ApiError.js";
import type { Role } from "../types/auth.js";

export type DbUser = {
  id: string;
  full_name: string;
  username: string;
  email: string;
  password_hash: string;
  role: Role;
  avatar_url: string | null;
  address: string | null;
  created_at: string;
};

export async function findUserByEmailOrUsername(identifier: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .or(`email.eq.${identifier},username.eq.${identifier}`)
    .maybeSingle<DbUser>();

  if (error) throw new ApiError(500, "DB error", "DB_FIND_USER");
  return data ?? null;
}

export async function assertUsernameEmailAvailable(username: string, email: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id,username,email")
    .or(`username.eq.${username},email.eq.${email}`);

  if (error) throw new ApiError(500, "DB error", "DB_CHECK_UNIQUE");

  const usernameTaken = (data ?? []).some((u) => u.username === username);
  const emailTaken = (data ?? []).some((u) => u.email === email);
  if (usernameTaken) throw new ApiError(409, "Username sudah digunakan");
  if (emailTaken) throw new ApiError(409, "Email sudah digunakan");
}

export async function createUser(input: {
  full_name: string;
  username: string;
  email: string;
  password: string;
  role?: Role;
}) {
  await assertUsernameEmailAvailable(input.username, input.email);

  const password_hash = await bcrypt.hash(input.password, 12);
  const { data, error } = await supabaseAdmin
    .from("users")
    .insert({
      full_name: input.full_name,
      username: input.username,
      email: input.email,
      password_hash,
      role: input.role ?? "user",
    })
    .select("*")
    .single<DbUser>();

  if (error) throw new ApiError(500, "Gagal membuat user", "DB_CREATE_USER");
  return data;
}

export async function verifyPassword(user: Pick<DbUser, "password_hash">, password: string) {
  return bcrypt.compare(password, user.password_hash);
}

export async function getUserPublicById(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("id,full_name,username,email,role,avatar_url,address,created_at")
    .eq("id", userId)
    .single();

  if (error) throw new ApiError(404, "User tidak ditemukan");
  return data;
}

export async function updateUserProfile(
  userId: string,
  patch: { full_name?: string; address?: string; avatar_url?: string | null },
) {
  const { data, error } = await supabaseAdmin
    .from("users")
    .update(patch)
    .eq("id", userId)
    .select("id,full_name,username,email,role,avatar_url,address,created_at")
    .single();

  if (error) throw new ApiError(500, "Gagal update profil", "DB_UPDATE_PROFILE");
  return data;
}

