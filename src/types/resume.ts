export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location?: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface ResumeData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  updatedAt: string;
  templateId: string;
}

export type TemplateId = "modern" | "classic" | "minimal";

export const DEFAULT_RESUME: Omit<ResumeData, "id" | "updatedAt"> = {
  name: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  experience: [],
  education: [],
  skills: [],
  templateId: "modern",
};
