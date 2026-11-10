import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0b171d] text-slate-100 flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Sidebar Modular yang tadi dibuat */}
      <Sidebar role="PORTAL ADMIN" />

      {/* Konten Utama Admin */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-20 bg-[#1d5b68] px-8 flex items-center justify-between border-b border-[#257282] shrink-0 sticky top-0 z-10 shadow-md">
          <h2 className="text-xl md:text-2xl fnont-bold text-white">
            Halo Selamat Datang, Admin!
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-200 hidden sm:inline">
              Dekanat / Pengelola FMIPA
            </span>
            <div className="w-10 h-10 rounded-full bg-[#12222a] text-cyan-300 flex items-center justify-center font-bold border border-cyan-400 shadow">
              A
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 space-y-8">{children}</main>
      </div>
    </div>
  );
}
