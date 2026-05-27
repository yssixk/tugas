export type Role = "user" | "admin";

export type JwtAccessPayload = {
  sub: string; // user id
  role: Role;
};

