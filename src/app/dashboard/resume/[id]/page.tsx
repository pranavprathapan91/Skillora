"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ResumeForm } from "@/components/ResumeForm";
import { ResumePreview } from "@/components/ResumePreview";
import { DownloadResumePdf } from "@/components/DownloadResumePdf";
import { RESUMES_KEY } from "@/lib/storage";
import type { ResumeData } from "@/types/resume";
import { DEFAULT_RESUME } from "@/types/resume";

const emptyPreview: ResumeData = {
  ...DEFAULT_RESUME,
  id: "",
  updatedAt: "",
};

export default function EditResumePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [previewData, setPreviewData] = useState<ResumeData>(emptyPreview);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESUMES_KEY);
      const list: ResumeData[] = raw ? JSON.parse(raw) : [];
      const found = list.find((r) => r.id === id);
      if (found) {
        setResume(found);
        setPreviewData(found);
      }
    } catch {
      // ignore
    }
  }, [id]);

  const handleSave = (data: ResumeData) => {
    try {
      const raw = localStorage.getItem(RESUMES_KEY);
      const list: ResumeData[] = raw ? JSON.parse(raw) : [];
      const idx = list.findIndex((r) => r.id === data.id);
      const next = idx >= 0 ? list.map((r, i) => (i === idx ? data : r)) : [...list, data];
      localStorage.setItem(RESUMES_KEY, JSON.stringify(next));
      router.push("/dashboard");
      router.refresh();
    } catch {
      alert("Failed to save.");
    }
  };

  const handleCancel = () => router.push("/dashboard");

  if (resume === null && id) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  if (resume === null) {
    return (
      <div className="py-20">
        <p className="text-slate-500">Resume not found.</p>
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
      <h1 className="text-2xl font-bold text-slate-900">Edit resume</h1>
      <p className="mt-1 text-slate-600">Update your details. Preview updates as you type.</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr,400px]">
        <ResumeForm
          initial={resume}
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
