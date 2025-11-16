import { Elysia, t } from "elysia";
import { translationService } from "../services/translation.service";

export const translationRoute = new Elysia().post(
  "/translate",
  async (context: any) => {
    const { user, body } = context;
    return await translationService.translate(user.id, {
      text: body.text,
      selectedOptions: body.selectedOptions,
    });
  },
  {
    body: t.Object({
      text: t.String(),
      selectedOptions: t.Array(t.String()),
    }),
  }
);
