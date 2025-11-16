export type TranslationRequest = {
  text: string;
  selectedOptions: Array<string>;
};

export type TranslationSuccessResponse = {
  id: string;
  translatedText: string;
  createdAt: Date;
};

export type TranslationErrorResponse = {
  success: false;
  message: string;
};

export type TranslationResponse =
  | TranslationSuccessResponse
  | TranslationErrorResponse;
