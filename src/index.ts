import { Elysia } from "elysia";
import { authRoute } from "./routes/auth.route";
import { protectedRoute } from "./routes/protected.route";
import { translationRoute } from "./routes/translation.route";
import { jwtMiddleware } from "./middlewares/jwt.middleware";
import { apiTokenGuard } from "./middlewares/token.middleware";
import { env } from "./env";
import { openapi } from "@elysiajs/openapi";

new Elysia()
  .use(openapi())
  .get("/", () => "hello")
  .use(authRoute)

  // Protected routes with JWT only
  .use(jwtMiddleware)
  .use(protectedRoute)

  // Translation routes with API Token only (no JWT)
  .use(apiTokenGuard)
  .use(translationRoute)

  .listen(env.PORT);
