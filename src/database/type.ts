import { users, translations } from "./schema";

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PublicUser = Omit<User, "password" | "token">;

export type NewTranslation = typeof translations.$inferInsert;
export type Translation = typeof translations.$inferSelect;
