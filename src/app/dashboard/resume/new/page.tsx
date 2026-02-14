"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ResumeForm } from "@/components/ResumeForm";
import { ResumePreview } from "@/components/ResumePreview";
import { DownloadResumePdf } from "@/components/DownloadResumePdf";
import { RESUMES_KEY } from "@/lib/storage";
import type { ResumeData } from "@/types/resume";
import { DEFAULT_RESUME } from "@/types/resume";
import { useState } from "react";

const emptyPreview: ResumeData = {
  ...DEFAULT_RESUME,
  id: "",
  updatedAt: "",
};

export default function NewResumePage() {
  const router = useRouter();
  const [previewData, setPreviewData] = useState<ResumeData>(emptyPreview);

  const handleSave = (data: ResumeData) => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(RESUMES_KEY) : null;
      const list: ResumeData[] = raw ? JSON.parse(raw) : [];
      const existing = list.findIndex((r) => r.id === data.id);
      const next = existing >= 0 ? list.map((r, i) => (i === existing ? data : r)) : [...list, data];
      localStorage.setItem(RESUMES_KEY, JSON.stringify(next));
      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Failed to save.");
    }
  };

  const handleCancel = () => router.push("/dashboard");

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">New resume</h1>
      <p className="mt-1 text-slate-600">
        Fill in your details. Use the preview on the right.{" "}
        <Link href="/dashboard/resume/from-jd" className="text-sky-600 hover:underline">
          Or create from a job description
        </Link>
        .
      </p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,400px]">
        <ResumeForm
          initial={null}
          onSave={handleSave}
          onCancel={handleCancel}
          onDataChange={setPreviewData}
        />
        <div className="lg:sticky lg:top-8 lg:self-start">
          <p className="text-sm font-medium text-slate-500 mb-2">Preview</p>
          <div className="mb-3">
            <DownloadResumePdf
              data={previewData}
              fileName="skillora-resume.pdf"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            />
          </div>
          <div className="max-h-[80vh] overflow-auto">
            <ResumePreview data={previewData} />
          </div>
        </div>
      </div>
    </div>
  );
}
