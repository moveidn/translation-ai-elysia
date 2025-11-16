import { translate } from "./openai.service";
import { NewTranslation } from "../database/type";
import { TranslationModel } from "../database/models/translation.model";
import { UserModel } from "../database/models/user.model";
import { env } from "../env";
import {
  TranslationRequest,
  TranslationResponse,
} from "../dto/translation.dto";

export class TranslationService {
  prepareContext(text: string, selectedOptions: Array<string>): string {
    const fullText = [];

    // Opening
    if (
      selectedOptions.includes("thanks") &&
      selectedOptions.includes("sorryDelay")
    ) {
      fullText.push(
        "Terima kasih sudah menghubungi kami, dan mohon maaf atas keterlambatan dalam merespons tiket ini."
      );
    } else {
      if (selectedOptions.includes("thanks")) {
        fullText.push("Terima kasih telah menghubungi kami.");
      }
      if (selectedOptions.includes("sorryDelay")) {
        fullText.push("Terima kasih atas kesabaran Anda.");
      }
    }

    if (selectedOptions.includes("inconvenience")) {
      fullText.push("Kami menyesal atas ketidaknyamanan yang Anda alami.");
    }

    // Main message
    fullText.push(text);

    // Closing
    if (selectedOptions.includes("anythingElse")) {
      fullText.push(
        "Jika ada hal lain yang bisa kami bantu, jangan ragu untuk menghubungi kami."
      );
    }

    return fullText.join("\n\n");
  }

  // logic for translate & logging
  async translate(
    userId: string,
    request: TranslationRequest
  ): Promise<TranslationResponse> {
    const { text, selectedOptions } = request;
    // gen balance from user
    const loggedUser = await UserModel.findById(userId);
    const currentBalance = loggedUser?.balance ?? 0;
    if (currentBalance <= 0) {
      return {
        success: false,
        message: "Insufficient Balance",
      };
    }

    // Prepare translation
    const margin = Number(env.OPENAI_API_MARGIN) || 100;
    const fullText = this.prepareContext(text, selectedOptions);
    const aiResponse = await translate(fullText);

    if (!aiResponse) {
      return {
        success: false,
        message: "Translation Failed",
      };
    }

    // update balance
    const cost = aiResponse?.usage?.total_tokens ?? 0;
    const newBalance: number = Math.max(0, currentBalance - cost);
    UserModel.update(userId, { balance: newBalance });

    // Logging
    const data: NewTranslation = {
      userId,
      payload: fullText,
      result: aiResponse?.output_text ?? "",
      usedToken: Math.round(
        (margin / 100) * (aiResponse?.usage?.total_tokens ?? 0)
      ),
      originalUsedToken: Math.round(aiResponse?.usage?.total_tokens ?? 0),
      tokenDetail: aiResponse?.usage,
      balance: newBalance,
    };
    const log = await TranslationModel.create(data);

    if (!log) {
      return {
        success: false,
        message: "Translation Failed",
      };
    }

    // mapping response
    const { id, result, createdAt } = log;
    return {
      id,
      translatedText: result,
      createdAt,
    };
  }
}

export const translationService = new TranslationService();
