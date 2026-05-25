export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#f0f4f8]">
      <div className="max-w-3xl mx-auto px-5 py-12">
        <a href="/dashboard" className="inline-flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 mb-8 transition-colors">
          ← Back to Dashboard
        </a>
        {children}
      </div>
    </div>
  )
}
