import { db } from "../client";
import { translations } from "../schema";
import { eq, count, desc } from "drizzle-orm";
import { Translation, NewTranslation } from "../type";

export const TranslationModel = {
  async create(data: NewTranslation): Promise<Translation | undefined> {
    const [translation] = await db
      .insert(translations)
      .values(data)
      .returning();
    return translation;
  },

  async findById(id: string): Promise<Translation | undefined> {
    return await db.query.translations.findFirst({
      where: eq(translations.id, id),
    });
  },

  async findByUserId(userId: string): Promise<Translation[]> {
    return await db.query.translations.findMany({
      where: eq(translations.userId, userId),
      orderBy: (translations, { desc }) => [desc(translations.createdAt)],
    });
  },

  async findByUserIdPaginated(
    userId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<Translation[]> {
    return await db
      .select()
      .from(translations)
      .where(eq(translations.userId, userId))
      .orderBy(desc(translations.createdAt))
      .limit(limit)
      .offset(offset);
  },

  async countByUserId(userId: string): Promise<number> {
    const result = await db
      .select({ count: count(translations.id) })
      .from(translations)
      .where(eq(translations.userId, userId));

    return result[0]?.count ?? 0;
  },

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(translations)
      .where(eq(translations.id, id))
      .returning();

    return result.length > 0;
  },
};
