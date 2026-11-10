"use client";

export default function UserPengembalianPage() {
  const pengembalian = [
    {
      id: "RET-001",
      barang: "Proyektor HD Epson",
      tglPinjam: "1 Agu 2026",
      tglKembali: "3 Agu 2026",
      status: "Sudah Dikembalikan",
    },
    {
      id: "RET-003",
      barang: "Sound System Portable",
      tglPinjam: "3 Agu 2026",
      tglKembali: "5 Agu 2026",
      status: "Proses Pengembalian",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">
        Status Pengembalian Barang
      </h1>
      <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340]">
        <div className="space-y-3">
          {pengembalian.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center p-4 bg-[#0b171d] rounded-xl border border-[#1b3340]"
            >
              <div>
                <p className="text-xs font-mono text-cyan-400 font-bold">
                  {item.id}
                </p>
                <p className="text-sm font-bold text-white mt-0.5">
                  {item.barang}
                </p>
                <p className="text-[11px] text-slate-400">
                  Kembali: {item.tglKembali}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-[10px] font-bold ${
                  item.status === "Sudah Dikembalikan"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                    : "bg-amber-950 text-amber-300 border border-amber-800/50"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
