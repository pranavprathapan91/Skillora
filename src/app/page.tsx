import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-semibold text-slate-800 tracking-tight">
            Skillora
          </span>
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard"
              className="bg-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-sky-700 transition"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 text-center max-w-2xl leading-tight">
          Your skills, brilliantly told.
        </h1>
        <p className="mt-6 text-lg text-slate-600 text-center max-w-xl">
          AI-powered resume and cover letter builder. Create professional,
          ATS-friendly documents in minutes.
        </p>
        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Link
            href="/dashboard/resume/new"
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-sky-700 transition shadow-lg shadow-sky-600/25"
          >
            Create resume
          </Link>
          <Link
            href="/dashboard/cover-letter/new"
            className="inline-flex items-center gap-2 border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium hover:border-slate-400 hover:bg-slate-50 transition"
          >
            Write cover letter
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-200 py-6 text-center text-slate-500 text-sm">
        Skillora — Build locally. Use with family.
      </footer>
    </div>
  );
}
