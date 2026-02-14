export const RESUMES_KEY = "skillora_resumes";
export const COVER_LETTERS_KEY = "skillora_cover_letters";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
