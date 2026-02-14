"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { parseJobDescription, type ParsedJD } from "@/lib/parseJobDescription";
import { RESUMES_KEY, generateId } from "@/lib/storage";
import type { ResumeData } from "@/types/resume";
import { DEFAULT_RESUME } from "@/types/resume";
import type { Experience } from "@/types/resume";

export default function ResumeFromJDPage() {
  const router = useRouter();
  const [jdText, setJdText] = useState("");
  const [jobTitleOverride, setJobTitleOverride] = useState("");
  const [companyOverride, setCompanyOverride] = useState("");
  const [parsed, setParsed] = useState<ParsedJD | null>(null);
  const [error, setError] = useState("");

  const handleParse = () => {
    setError("");
    if (!jdText.trim()) {
      setError("Paste a job description first.");
      return;
    }
    const result = parseJobDescription(jdText, {
      jobTitle: jobTitleOverride.trim() || undefined,
      company: companyOverride.trim() || undefined,
    });
    setParsed(result);
  };

  const handleCreateResume = () => {
    if (!parsed) {
      setError("Click “Parse JD” first.");
      return;
    }
    setError("");
    const id = generateId();
    const now = new Date().toISOString();

    const placeholderExperience: Experience = {
      id: generateId(),
      jobTitle: parsed.jobTitle,
      company: parsed.company || "Company from JD",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description:
        "Add your responsibilities and achievements here. Use bullet points from the job description as a guide.",
    };

    const newResume: ResumeData = {
      ...DEFAULT_RESUME,
      id,
      updatedAt: now,
      summary: parsed.suggestedSummary,
      skills: parsed.skills,
      experience: [placeholderExperience],
      templateId: "modern",
    };

    try {
      const raw = localStorage.getItem(RESUMES_KEY);
      const list: ResumeData[] = raw ? JSON.parse(raw) : [];
      localStorage.setItem(RESUMES_KEY, JSON.stringify([...list, newResume]));
      router.push(`/dashboard/resume/${id}`);
      router.refresh();
    } catch {
      setError("Failed to create resume.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Create resume from job description
      </h1>
      <p className="mt-1 text-slate-600">
        Paste a LinkedIn (or any) job description. We’ll extract the role, company, and
        skills and pre-fill a resume—no API key needed.
      </p>

      <div className="mt-8 max-w-2xl space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Job description (paste full text)
            </span>
            <textarea
              value={jdText}
              onChange={(e) => {
                setJdText(e.target.value);
                setParsed(null);
              }}
              rows={12}
              placeholder="Paste the full job description from LinkedIn or the job posting here..."
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Job title (optional override)
              </span>
              <input
                type="text"
                value={jobTitleOverride}
                onChange={(e) => setJobTitleOverride(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Company (optional override)
              </span>
              <input
                type="text"
                value={companyOverride}
                onChange={(e) => setCompanyOverride(e.target.value)}
                placeholder="e.g. Acme Inc."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </label>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleParse}
              className="rounded-lg bg-sky-600 px-4 py-2 font-medium text-white hover:bg-sky-700"
            >
              Parse JD
            </button>
            {parsed && (
              <button
                type="button"
                onClick={handleCreateResume}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                Create resume and edit
              </button>
            )}
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </div>

        {parsed && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-sm font-semibold text-slate-800">
              Extracted (edit in resume after creating)
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              <strong>Role:</strong> {parsed.jobTitle}
            </p>
            {parsed.company && (
              <p className="mt-1 text-sm text-slate-600">
                <strong>Company:</strong> {parsed.company}
              </p>
            )}
            {parsed.skills.length > 0 && (
              <p className="mt-2 text-sm text-slate-600">
                <strong>Skills:</strong> {parsed.skills.slice(0, 12).join(", ")}
                {parsed.skills.length > 12 && ` +${parsed.skills.length - 12} more`}
              </p>
            )}
            <p className="mt-2 text-sm text-slate-600">
              <strong>Suggested summary:</strong> {parsed.suggestedSummary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
