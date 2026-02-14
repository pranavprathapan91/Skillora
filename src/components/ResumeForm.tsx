"use client";

import { useState, useEffect } from "react";
import type { ResumeData, Experience, Education, TemplateId } from "@/types/resume";
import { DEFAULT_RESUME } from "@/types/resume";
import { generateId } from "@/lib/storage";
import clsx from "clsx";

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: "modern", label: "Modern" },
  { id: "classic", label: "Classic" },
  { id: "minimal", label: "Minimal" },
];

interface ResumeFormProps {
  initial?: Partial<ResumeData> | null;
  onSave: (data: ResumeData) => void;
  onCancel: () => void;
  onDataChange?: (data: ResumeData) => void;
}

export function ResumeForm({ initial, onSave, onCancel, onDataChange }: ResumeFormProps) {
  const [data, setData] = useState<ResumeData>(() => {
    const base = {
      ...DEFAULT_RESUME,
      id: initial?.id ?? generateId(),
      updatedAt: new Date().toISOString(),
      ...initial,
    };
    return base as ResumeData;
  });

  const update = (updates: Partial<ResumeData>) => {
    setData((prev) => {
      const next = { ...prev, ...updates, updatedAt: new Date().toISOString() };
      onDataChange?.(next as ResumeData);
      return next;
    });
  };

  useEffect(() => {
    onDataChange?.(data);
  }, []);

  const addExperience = () => {
    const newExp: Experience = {
      id: generateId(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    update({ experience: [...data.experience, newExp] });
  };

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    update({
      experience: data.experience.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    });
  };

  const removeExperience = (id: string) => {
    update({
      experience: data.experience.filter((e) => e.id !== id),
    });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: generateId(),
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    update({ education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    update({
      education: data.education.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    });
  };

  const removeEducation = (id: string) => {
    update({ education: data.education.filter((e) => e.id !== id) });
  };

  const addSkill = () => update({ skills: [...data.skills, ""] });
  const updateSkill = (i: number, v: string) => {
    const next = [...data.skills];
    next[i] = v;
    update({ skills: next });
  };
  const removeSkill = (i: number) => {
    update({ skills: data.skills.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Template</h3>
        <div className="mt-3 flex gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => update({ templateId: t.id })}
              className={clsx(
                "rounded-lg border px-4 py-2 text-sm font-medium transition",
                data.templateId === t.id
                  ? "border-sky-500 bg-sky-50 text-sky-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Contact</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Full name</span>
            <input
              type="text"
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="Jane Doe"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={data.email}
              onChange={(e) => update({ email: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="jane@example.com"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Phone</span>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => update({ phone: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="+1 234 567 8900"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Location</span>
            <input
              type="text"
              value={data.location ?? ""}
              onChange={(e) => update({ location: e.target.value })}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              placeholder="City, Country"
            />
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Summary</h3>
        <textarea
          value={data.summary}
          onChange={(e) => update({ summary: e.target.value })}
          rows={4}
          className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          placeholder="Brief professional summary..."
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Experience</h3>
          <button
            type="button"
            onClick={addExperience}
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            + Add
          </button>
        </div>
        <div className="mt-4 space-y-6">
          {data.experience.map((exp) => (
            <div
              key={exp.id}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Job title"
                  value={exp.jobTitle}
                  onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={exp.location ?? ""}
                  onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Start date"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                    className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="End date"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                    className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
                    disabled={exp.current}
                  />
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) =>
                        updateExperience(exp.id, {
                          current: e.target.checked,
                          endDate: e.target.checked ? "Present" : exp.endDate,
                        })
                      }
                    />
                    Current
                  </label>
                </div>
              </div>
              <textarea
                placeholder="Description (bullets or paragraph)"
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                rows={3}
                className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeExperience(exp.id)}
                className="mt-2 text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Education</h3>
          <button
            type="button"
            onClick={addEducation}
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            + Add
          </button>
        </div>
        <div className="mt-4 space-y-4">
          {data.education.map((edu) => (
            <div
              key={edu.id}
              className="rounded-lg border border-slate-200 bg-slate-50/50 p-4"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Degree"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="School"
                  value={edu.school}
                  onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={edu.location ?? ""}
                  onChange={(e) => updateEducation(edu.id, { location: e.target.value })}
                  className="rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Start"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                    className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="End"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                    className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeEducation(edu.id)}
                className="mt-2 text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800">Skills</h3>
          <button
            type="button"
            onClick={addSkill}
            className="text-sm font-medium text-sky-600 hover:text-sky-700"
          >
            + Add
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {data.skills.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <input
                type="text"
                value={s}
                onChange={(e) => updateSkill(i, e.target.value)}
                placeholder="Skill"
                className="w-36 rounded border border-slate-300 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeSkill(i)}
                className="text-slate-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onSave({ ...data, updatedAt: new Date().toISOString() })}
          className="rounded-lg bg-sky-600 px-6 py-2.5 font-medium text-white hover:bg-sky-700"
        >
          Save resume
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-6 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
