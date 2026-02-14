export interface CoverLetterData {
  id: string;
  resumeId: string | null;
  companyName: string;
  jobTitle: string;
  hiringManager?: string;
  jobDescription?: string;
  content: string;
  updatedAt: string;
}

export const DEFAULT_COVER_LETTER: Omit<CoverLetterData, "id" | "updatedAt"> = {
  resumeId: null,
  companyName: "",
  jobTitle: "",
  hiringManager: "",
  jobDescription: "",
  content: "",
};
