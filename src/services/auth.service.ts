import crypto from "crypto";
import { UserModel } from "../database/models/user.model";
import type {
  LoginResponse,
  registerResponse,
  tokenResponse,
} from "../dto/auth.dto";

export class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    // Cari user berdasarkan email
    const userRaw = await UserModel.findByEmail(email);

    if (!userRaw) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    // Verifikasi password
    const match = await Bun.password.verify(password, userRaw.password);

    if (!match) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    return {
      success: true,
      user: UserModel.toPublic(userRaw),
    };
  }

  async register(email: string, password: string): Promise<registerResponse> {
    // 1) Cek apakah user sudah ada
    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      return {
        success: false,
        message: "Email already registered",
      };
    }

    // 2) Hash password
    const hashedPassword = await Bun.password.hash(password);
    const token = crypto.randomBytes(32).toString("hex");

    // 3) Save user
    const newUser = await UserModel.create({
      email,
      password: hashedPassword,
      token,
    });

    if (!newUser) {
      return {
        success: false,
        message: "Failed to create user",
      };
    }

    return {
      success: true,
      user: UserModel.toPublic(newUser),
    };
  }

  // generate new user token
  async generateToken(userId: string): Promise<tokenResponse> {
    try {
      // Verify user exists first
      const user = await UserModel.findById(userId);
      if (!user) {
        return {
          success: false,
          message: "User not found",
        };
      }

      const token = crypto.randomBytes(32).toString("hex");
      const updatedUser = await UserModel.update(userId, { token });

      if (!updatedUser) {
        return {
          success: false,
          message: "Failed to update token",
        };
      }

      return {
        success: true,
        token,
      };
    } catch (error) {
      console.error("Error generating token:", error);
      return {
        success: false,
        message: "An error occurred while generating token",
      };
    }
  }
}

export const authService = new AuthService();
