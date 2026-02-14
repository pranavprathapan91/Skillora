"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { COVER_LETTERS_KEY, RESUMES_KEY } from "@/lib/storage";
import type { CoverLetterData } from "@/types/cover-letter";
import type { ResumeData } from "@/types/resume";
import { DownloadCoverLetterPdf } from "@/components/DownloadCoverLetterPdf";

export default function EditCoverLetterPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<CoverLetterData | null>(null);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [aiLoading, setAiLoading] = useState<"generate" | "improve" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COVER_LETTERS_KEY);
      const list: CoverLetterData[] = raw ? JSON.parse(raw) : [];
      const found = list.find((c) => c.id === id);
      if (found) setData(found);
      const rRaw = localStorage.getItem(RESUMES_KEY);
      if (rRaw) setResumes(JSON.parse(rRaw));
    } catch {
      // ignore
    }
  }, [id]);

  const update = (updates: Partial<CoverLetterData>) => {
    setData((prev) =>
      prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null
    );
    setError(null);
  };

  const selectedResume = data?.resumeId
    ? resumes.find((r) => r.id === data.resumeId)
    : null;

  const handleGenerate = async () => {
    if (!data?.companyName || !data?.jobTitle) {
      setError("Company and job title are required.");
      return;
    }
    setAiLoading("generate");
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.companyName,
          jobTitle: data.jobTitle,
          hiringManager: data.hiringManager || undefined,
          jobDescription: data.jobDescription || undefined,
          resumeSummary: selectedResume?.summary,
          resumeExperience: selectedResume?.experience
            ?.slice(0, 2)
            .map(
              (e) =>
                `${e.jobTitle} at ${e.company}: ${e.description?.slice(0, 200)}`
            )
            .join("\n"),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to generate");
      update({ content: json.content });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate.");
    } finally {
      setAiLoading(null);
    }
  };

  const handleImprove = async () => {
    if (!data?.content?.trim()) {
      setError("Add some content first.");
      return;
    }
    setAiLoading("improve");
    setError(null);
    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.content,
          context: `Cover letter for ${data.jobTitle} at ${data.companyName}.`,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to improve");
      update({ content: json.text });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to improve.");
    } finally {
      setAiLoading(null);
    }
  };

  const handleSave = () => {
    if (!data) return;
    try {
      const raw = localStorage.getItem(COVER_LETTERS_KEY);
      const list: CoverLetterData[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((c) => c.id === data.id);
      const next = idx >= 0 ? list.map((c, i) => (i === idx ? { ...data, updatedAt: new Date().toISOString() } : c)) : [...list, { ...data, updatedAt: new Date().toISOString() }];
      localStorage.setItem(COVER_LETTERS_KEY, JSON.stringify(next));
      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Failed to save.");
    }
  };

  if (data === null && id) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  if (data === null) {
    return (
      <div className="py-20">
        <p className="text-slate-500">Cover letter not found.</p>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mt-4 text-sky-600 hover:underline"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Edit cover letter</h1>
      <p className="mt-1 text-slate-600">
        {data.jobTitle && data.companyName
          ? `${data.jobTitle} at ${data.companyName}`
          : "Update your cover letter."}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,400px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">Job details</h3>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Company name *</span>
                <input
                  type="text"
                  value={data.companyName}
                  onChange={(e) => update({ companyName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Job title *</span>
                <input
                  type="text"
                  value={data.jobTitle}
                  onChange={(e) => update({ jobTitle: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Hiring manager (optional)</span>
                <input
                  type="text"
                  value={data.hiringManager ?? ""}
                  onChange={(e) => update({ hiringManager: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Link resume</span>
                <select
                  value={data.resumeId ?? ""}
                  onChange={(e) => update({ resumeId: e.target.value || null })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="">None</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name || "Untitled resume"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Job description (optional)</span>
                <textarea
                  value={data.jobDescription ?? ""}
                  onChange={(e) => update({ jobDescription: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </label>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold text-slate-800">Cover letter</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={aiLoading !== null}
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
                >
                  {aiLoading === "generate" ? "Generating…" : "Generate with AI"}
                </button>
                <button
                  type="button"
                  onClick={handleImprove}
                  disabled={aiLoading !== null || !data.content.trim()}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {aiLoading === "improve" ? "Improving…" : "Improve with AI"}
                </button>
              </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <textarea
              value={data.content}
              onChange={(e) => update({ content: e.target.value })}
              rows={14}
              className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-sky-600 px-6 py-2.5 font-medium text-white hover:bg-sky-700"
            >
              Save
            </button>
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="text-sm font-medium text-slate-500 mb-2">Preview & export</p>
          <div className="mb-3">
            <DownloadCoverLetterPdf
              data={data}
              fileName={`cover-${data.companyName || "letter"}.pdf`}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm max-h-[70vh] overflow-auto">
            <p className="whitespace-pre-wrap text-sm text-slate-700">
              {data.content || "Your cover letter will appear here."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
