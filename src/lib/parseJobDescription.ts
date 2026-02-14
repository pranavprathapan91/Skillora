/**
 * Client-side job description parser. No API, no token.
 * Extracts job title, company, skills, and builds a suggested resume summary.
 */

const SKILL_SECTION_HEADERS = [
  "skills",
  "requirements",
  "qualifications",
  "what you'll need",
  "what you need",
  "we're looking for",
  "you have",
  "you bring",
  "technical skills",
  "key qualifications",
  "must have",
  "required",
  "competencies",
];

const COMMON_SKILLS = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "React",
  "Node.js",
  "SQL",
  "AWS",
  "Azure",
  "GCP",
  "HTML",
  "CSS",
  "REST",
  "API",
  "Git",
  "Agile",
  "Scrum",
  "Leadership",
  "Communication",
  "Problem solving",
  "Project management",
  "Data analysis",
  "Machine learning",
  "Excel",
  "Figma",
  "UI/UX",
  "DevOps",
  "Kubernetes",
  "Docker",
  "CI/CD",
  "Testing",
  "JIRA",
  "Cross-functional",
  "Stakeholder management",
  "Written communication",
  "Presentation",
  "Collaboration",
  "Time management",
  "Detail-oriented",
  "Self-motivated",
];

function normalizeText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

function findSectionContent(
  text: string,
  headers: string[]
): string | null {
  const lower = text.toLowerCase();
  for (const header of headers) {
    const idx = lower.indexOf(header);
    if (idx === -1) continue;
    const after = text.slice(idx + header.length);
    const d = after.indexOf("\n\n");
    const s = after.search(/\n[A-Z][a-z]+:/);
    const end = Math.min(
      d >= 0 ? d : after.length,
      s >= 0 ? s : after.length,
      after.length
    );
    const block = after.slice(0, end).trim();
    if (block.trim().length > 10) return block.trim();
  }
  return null;
}

function extractBulletsOrPhrases(block: string): string[] {
  const items: string[] = [];
  const lines = block.split(/\n/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    const cleaned = line.replace(/^[\s•\-*]\s*/, "").trim();
    if (cleaned.length < 2) continue;
    if (cleaned.length > 80) {
      items.push(cleaned.slice(0, 80));
      continue;
    }
    items.push(cleaned);
  }
  return items;
}

function extractCommaOrBulletSkills(block: string): string[] {
  const skills: string[] = [];
  const commaParts = block.split(/[,;]|\band\b/).map((p) => p.trim()).filter(Boolean);
  for (const part of commaParts) {
    if (part.length > 3 && part.length < 50) skills.push(part);
  }
  const bulletParts = extractBulletsOrPhrases(block);
  for (const p of bulletParts) {
    if (p.length > 3 && p.length < 50) skills.push(p);
  }
  return [...new Set(skills)];
}

function matchCommonSkills(text: string): string[] {
  const found: string[] = [];
  const lower = text.toLowerCase();
  for (const skill of COMMON_SKILLS) {
    const re = new RegExp(`\\b${skill.replace(/[+/]/g, "\\$&")}\\b`, "i");
    if (re.test(lower)) found.push(skill);
  }
  return found;
}

export interface ParsedJD {
  jobTitle: string;
  company: string;
  skills: string[];
  suggestedSummary: string;
}

export function parseJobDescription(
  rawText: string,
  overrides?: { jobTitle?: string; company?: string }
): ParsedJD {
  const text = normalizeText(rawText);
  const lines = rawText.split(/\n/).map((l) => l.trim()).filter(Boolean);

  let jobTitle = overrides?.jobTitle ?? "";
  let company = overrides?.company ?? "";

  if (!jobTitle) {
    const titlePatterns = [
      /(?:job title|position|role|title)\s*[:\-]\s*([^\n]+)/i,
      /^([A-Za-z\s]+(?:Engineer|Manager|Analyst|Designer|Developer|Specialist|Lead|Director|Coordinator|Consultant))(?:\s*[-–—|]\s*|\s+at\s+)/i,
      /^([^\n]{5,60})$/m,
    ];
    for (const re of titlePatterns) {
      const m = rawText.match(re);
      if (m && m[1]) {
        jobTitle = m[1].trim();
        if (jobTitle.length > 3 && jobTitle.length < 80) break;
      }
    }
    if (!jobTitle && lines[0] && lines[0].length < 80) jobTitle = lines[0];
  }

  if (!company) {
    const companyPatterns = [
      /(?:at|@|company)\s+([A-Za-z0-9&\s]+?)(?:\s+is\s+|\s+hiring|\.|$)/i,
      /([A-Za-z0-9&\s]+)\s+is\s+hiring/i,
      /(?:company name|company)\s*[:\-]\s*([^\n]+)/i,
    ];
    for (const re of companyPatterns) {
      const m = rawText.match(re);
      if (m && m[1]) {
        company = m[1].trim();
        if (company.length > 1 && company.length < 60) break;
      }
    }
  }

  let skills: string[] = [];
  const sectionBlock = findSectionContent(rawText, SKILL_SECTION_HEADERS);
  if (sectionBlock) {
    skills = extractCommaOrBulletSkills(sectionBlock);
  }
  const common = matchCommonSkills(rawText);
  skills = [...new Set([...skills, ...common])].slice(0, 25);

  const role = jobTitle || "professional";
  const skillsPhrase =
    skills.length > 0
      ? skills.slice(0, 6).join(", ") + (skills.length > 6 ? " and more." : ".")
      : "relevant experience.";
  const suggestedSummary = `${role} with strong background in ${skillsPhrase} Ready to contribute and grow in a collaborative environment. Add your own experience and achievements to personalize.`;

  return {
    jobTitle: jobTitle || "Role from JD",
    company,
    skills,
    suggestedSummary,
  };
}
