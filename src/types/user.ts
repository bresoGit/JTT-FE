// src/types/user.ts
export type UserRole = "USER" | "ADMIN";

export interface AppUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
