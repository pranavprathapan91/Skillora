"use client";

import type { ResumeData, TemplateId } from "@/types/resume";
import clsx from "clsx";

interface ResumePreviewProps {
  data: ResumeData;
  className?: string;
}

function ModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-800 p-8 max-w-[210mm]">
      <div className="border-b-2 border-sky-600 pb-3">
        <h1 className="text-2xl font-bold text-slate-900">{data.name || "Your Name"}</h1>
        <p className="text-sm text-slate-600 mt-1">
          {[data.email, data.phone, data.location].filter(Boolean).join(" · ")}
        </p>
      </div>
      {data.summary && (
        <section className="mt-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Summary
          </h2>
          <p className="text-sm mt-1 text-slate-700">{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Experience
          </h2>
          <div className="mt-2 space-y-3">
            {data.experience.map((e) => (
              <div key={e.id}>
                <p className="font-semibold text-slate-900">{e.jobTitle}</p>
                <p className="text-sm text-slate-600">
                  {e.company}
                  {e.location && ` · ${e.location}`} · {e.startDate} – {e.endDate}
                </p>
                {e.description && (
                  <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {data.education.length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Education
          </h2>
          <div className="mt-2 space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <p className="font-semibold text-slate-900">{edu.degree}</p>
                <p className="text-sm text-slate-600">
                  {edu.school}
                  {edu.location && ` · ${edu.location}`} · {edu.startDate} – {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.filter(Boolean).length > 0 && (
        <section className="mt-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-600">
            Skills
          </h2>
          <p className="text-sm mt-1 text-slate-700">
            {data.skills.filter(Boolean).join(", ")}
          </p>
        </section>
      )}
    </div>
  );
}

function ClassicTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-800 p-8 max-w-[210mm] font-serif">
      <div className="text-center border-b border-slate-300 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">{data.name || "Your Name"}</h1>
        <p className="text-sm text-slate-600 mt-1">
          {[data.email, data.phone, data.location].filter(Boolean).join(" | ")}
        </p>
      </div>
      {data.summary && (
        <section className="mt-4">
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1">
            Professional Summary
          </h2>
          <p className="text-sm mt-2 text-slate-700">{data.summary}</p>
        </section>
      )}
      {data.experience.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1">
            Work Experience
          </h2>
          <div className="mt-3 space-y-3">
            {data.experience.map((e) => (
              <div key={e.id}>
                <p className="font-bold text-slate-900">{e.jobTitle}</p>
                <p className="text-sm text-slate-600">
                  {e.company}
                  {e.location && `, ${e.location}`} | {e.startDate} – {e.endDate}
                </p>
                {e.description && (
                  <p className="text-sm text-slate-700 mt-1 whitespace-pre-line">
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {data.education.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1">
            Education
          </h2>
          <div className="mt-3 space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <p className="font-bold text-slate-900">{edu.degree}</p>
                <p className="text-sm text-slate-600">
                  {edu.school}
                  {edu.location && `, ${edu.location}`} | {edu.startDate} – {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
      {data.skills.filter(Boolean).length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1">
            Skills
          </h2>
          <p className="text-sm mt-2 text-slate-700">
            {data.skills.filter(Boolean).join(", ")}
          </p>
        </section>
      )}
    </div>
  );
}

function MinimalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white text-slate-800 p-8 max-w-[210mm]">
      <h1 className="text-3xl font-light text-slate-900 tracking-tight">
        {data.name || "Your Name"}
      </h1>
      <p className="text-sm text-slate-500 mt-2">
        {[data.email, data.phone, data.location].filter(Boolean).join(" · ")}
      </p>
      {data.summary && (
        <p className="mt-6 text-slate-700 text-sm leading-relaxed">{data.summary}</p>
      )}
      {data.experience.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Experience
          </h2>
          <div className="mt-4 space-y-5">
            {data.experience.map((e) => (
              <div key={e.id}>
                <p className="font-medium text-slate-900">{e.jobTitle}</p>
                <p className="text-sm text-slate-500">
                  {e.company} · {e.startDate} – {e.endDate}
                </p>
                {e.description && (
                  <p className="text-sm text-slate-600 mt-1 whitespace-pre-line">
                    {e.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {data.education.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xs font-medium uppercase tracking-widest text-slate-400">
            Education
          </h2>
          <div className="mt-4 space-y-2">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <p className="font-medium text-slate-900">{edu.degree}</p>
                <p className="text-sm text-slate-500">
                  {edu.school} · {edu.startDate} – {edu.endDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {data.skills.filter(Boolean).length > 0 && (
        <p className="mt-8 text-sm text-slate-600">
          {data.skills.filter(Boolean).join(" · ")}
        </p>
      )}
    </div>
  );
}

export function ResumePreview({ data, className }: ResumePreviewProps) {
  const template: TemplateId = data.templateId || "modern";
  return (
    <div
      className={clsx(
        "rounded-lg shadow-lg overflow-hidden bg-slate-100",
        className
      )}
    >
      {template === "modern" && <ModernTemplate data={data} />}
      {template === "classic" && <ClassicTemplate data={data} />}
      {template === "minimal" && <MinimalTemplate data={data} />}
    </div>
  );
}
