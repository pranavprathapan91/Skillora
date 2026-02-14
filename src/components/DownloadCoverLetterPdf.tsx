"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { CoverLetterPdfDocument } from "./CoverLetterPdfDocument";
import type { CoverLetterData } from "@/types/cover-letter";

interface DownloadCoverLetterPdfProps {
  data: CoverLetterData;
  fileName?: string;
  className?: string;
}

export function DownloadCoverLetterPdf({
  data,
  fileName = "cover-letter.pdf",
  className,
}: DownloadCoverLetterPdfProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const blob = await pdf(<CoverLetterPdfDocument data={data} />).toBlob();
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
