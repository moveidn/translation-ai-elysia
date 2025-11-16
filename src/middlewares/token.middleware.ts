import { Elysia } from "elysia";
import { UserModel } from "../database/models/user.model";

export const apiTokenGuard = new Elysia()
  .decorate("user", null as any)
  .derive({ as: "scoped" }, async ({ request }) => {
    const auth = request.headers.get("authorization");

    if (!auth?.startsWith("Bearer ")) {
      return { user: null };
    }

    const token = auth.slice(7);

    // cek ke database apakah token valid
    const user = await UserModel.findByToken(token);

    return { user: user ?? null };
  })
  .guard({
    beforeHandle({ user, set }) {
      if (!user) {
        set.status = 401;
        return { error: "Invalid or missing token" };
      }
    },
  });
