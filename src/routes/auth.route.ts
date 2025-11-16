import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import { env } from "../env";
import { authService } from "../services/auth.service";

export const authRoute = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: env.JWT_SECRET,
      exp: "1d",
    })
  )
  .post(
    "/login",
    async ({ body, jwt }) => {
      const result = await authService.login(body.email, body.password);

      if (!result.success) return result;

      const token = await jwt.sign({
        id: result.user?.id,
        email: result.user?.email,
      });

      return {
        success: true,
        user: result.user,
        token,
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  )
  .post(
    "/register",
    async ({ body }) => {
      return await authService.register(body.email, body.password);
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  );
