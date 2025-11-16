import { Elysia } from "elysia";
import { env } from "../env";
import jwt from "@elysiajs/jwt";

export const jwtMiddleware = new Elysia()
  .decorate("user", null as any)
  .use(
    jwt({
      name: "jwt",
      secret: env.JWT_SECRET,
    })
  )
  .derive({ as: "scoped" }, async ({ request, jwt }) => {
    const auth = request.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return { user: null };

    try {
      const token = auth.slice(7);
      const payload = await jwt.verify(token);
      return { user: payload ?? null };
    } catch {
      return { user: null };
    }
  })
  .guard({
    beforeHandle({ user, set }) {
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }
    },
  });
