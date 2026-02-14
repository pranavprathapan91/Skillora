"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { ResumePdfDocument } from "./ResumePdfDocument";
import type { ResumeData } from "@/types/resume";

interface DownloadResumePdfProps {
  data: ResumeData;
  fileName?: string;
  className?: string;
}

export function DownloadResumePdf({
  data,
  fileName = "resume.pdf",
  className,
}: DownloadResumePdfProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const blob = await pdf(<ResumePdfDocument data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName.replace(/\.pdf$/i, "") + ".pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={className}
    >
      {loading ? "Generating…" : "Download PDF"}
    </button>
  );
}
