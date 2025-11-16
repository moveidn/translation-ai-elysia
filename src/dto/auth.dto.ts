import { PublicUser, User } from "../database/type";

export type LoginResponse =
  | { success: true; user: PublicUser }
  | { success: false; message: string };

export type registerResponse =
  | { success: true; user: PublicUser }
  | { success: false; message: string };

export type tokenResponse =
  | { success: true; token: string }
  | { success: false; message: string };
