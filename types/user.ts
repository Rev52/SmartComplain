export type Role = "user" | "admin";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: Role;
  phone: string | null;
  created_at: string;
}
