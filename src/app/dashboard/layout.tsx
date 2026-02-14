import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-slate-800">
            Skillora
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/resume/new"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              New resume
            </Link>
            <Link
              href="/dashboard/cover-letter/new"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              New cover letter
            </Link>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
