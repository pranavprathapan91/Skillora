"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ResumeData } from "@/types/resume";
import type { CoverLetterData } from "@/types/cover-letter";
import { RESUMES_KEY, COVER_LETTERS_KEY } from "@/lib/storage";

export default function DashboardPage() {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetterData[]>([]);

  useEffect(() => {
    try {
      const r = localStorage.getItem(RESUMES_KEY);
      const c = localStorage.getItem(COVER_LETTERS_KEY);
      if (r) setResumes(JSON.parse(r));
      if (c) setCoverLetters(JSON.parse(c));
    } catch {
      // ignore
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-slate-600">
        Your resumes and cover letters. Everything is saved in this browser.
      </p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-800">Resumes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/resume/new"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-slate-500 hover:border-sky-400 hover:bg-sky-50/50 hover:text-sky-700 transition"
          >
            <span className="text-3xl">+</span>
            <span className="mt-2 font-medium">New resume</span>
          </Link>
          <Link
            href="/dashboard/resume/from-jd"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-slate-500 hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-700 transition"
          >
            <span className="text-2xl">📄</span>
            <span className="mt-2 font-medium">From job description</span>
            <span className="mt-1 text-xs">No API key</span>
          </Link>
          {resumes.map((r) => (
            <Link
              key={r.id}
              href={`/dashboard/resume/${r.id}`}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <p className="font-medium text-slate-900">
                {r.name || "Untitled resume"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Updated {new Date(r.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-800">Cover letters</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/cover-letter/new"
            className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 text-slate-500 hover:border-sky-400 hover:bg-sky-50/50 hover:text-sky-700 transition"
          >
            <span className="text-3xl">+</span>
            <span className="mt-2 font-medium">New cover letter</span>
          </Link>
          {coverLetters.map((c) => (
            <Link
              key={c.id}
              href={`/dashboard/cover-letter/${c.id}`}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <p className="font-medium text-slate-900">
                {c.companyName && c.jobTitle
                  ? `${c.jobTitle} at ${c.companyName}`
                  : "Untitled cover letter"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Updated {new Date(c.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
