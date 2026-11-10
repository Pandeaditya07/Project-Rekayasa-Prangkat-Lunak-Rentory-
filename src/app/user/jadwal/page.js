"use client";

export default function UserDashboardPage() {
  const jadwalGedung = [
    {
      id: 1,
      gedung: "Gedung AS Biologi",
      acara: "Rapat Umum Growth Class Udayana 2026",
      peminjam: "BEM FMIPA",
      tanggal: "Minggu, 2 Agustus 2026",
      waktu: "12.00 - 17.00 WITA",
      durasi: "300 Menit",
    },
    {
      id: 2,
      gedung: "MIPA 2.4 Dekanat FMIPA",
      acara: "Rapat Umum INVENTION",
      peminjam: "HIMAIF UDAYANA",
      tanggal: "Minggu, 2 Agustus 2026",
      waktu: "12.00 - 17.00 WITA",
      durasi: "300 Menit",
    },
    {
      id: 3,
      gedung: "Gedung AS Biologi",
      acara: "Rapat Umum Pioneer PKM 2026",
      peminjam: "BEM FMIPA",
      tanggal: "Minggu, 2 Agustus 2026",
      waktu: "12.00 - 17.00 WITA",
      durasi: "300 Menit",
    },
    {
      id: 4,
      gedung: "MIPA 2.4 Dekanat FMIPA",
      acara: "Rapat Umum Program Kerja Pyston",
      peminjam: "HIMAIF UDAYANA",
      tanggal: "Minggu, 2 Agustus 2026",
      waktu: "12.00 - 17.00 WITA",
      durasi: "300 Menit",
    },
    {
      id: 5,
      gedung: "Gedung AS Biologi",
      acara: "Rapat Umum Growth Class Udayana 2026",
      peminjam: "BEM FMIPA",
      tanggal: "Minggu, 2 Agustus 2026",
      waktu: "12.00 - 17.00 WITA",
      durasi: "300 Menit",
    },
    {
      id: 6,
      gedung: "MIPA 2.4 Dekanat FMIPA",
      acara: "Rapat Umum INVENTION",
      peminjam: "HIMAIF UDAYANA",
      tanggal: "Minggu, 2 Agustus 2026",
      waktu: "12.00 - 17.00 WITA",
      durasi: "300 Menit",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {jadwalGedung.map((item) => (
          <div
            key={item.id}
            className="bg-[#194c56] p-6 rounded-2xl shadow-lg border border-[#257585]/40 text-center space-y-3 hover:border-cyan-400/60 transition"
          >
            <h3 className="text-xl font-bold text-white tracking-wide">
              {item.gedung}
            </h3>
            <p className="text-xs font-semibold text-slate-200">{item.acara}</p>

            <div className="text-[11px] text-cyan-100 space-y-1 pt-2 border-t border-[#257585]/50">
              <div className="flex justify-between max-w-xs mx-auto">
                <span className="text-slate-300">Peminjam</span>
                <span className="font-semibold text-white">
                  {item.peminjam}
                </span>
              </div>
              <div className="flex justify-between max-w-xs mx-auto">
                <span className="text-slate-300">Hari/Tanggal</span>
                <span className="font-semibold text-white">{item.tanggal}</span>
              </div>
              <div className="flex justify-between max-w-xs mx-auto">
                <span className="text-slate-300">Waktu</span>
                <span className="font-semibold text-white">{item.waktu}</span>
              </div>
              <div className="flex justify-between max-w-xs mx-auto">
                <span className="text-slate-300">Durasi</span>
                <span className="font-semibold text-white">{item.durasi}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
