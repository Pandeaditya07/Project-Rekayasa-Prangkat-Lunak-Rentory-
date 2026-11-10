"use client";

import { useState } from "react";

export default function PeminjamanPage() {
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  const [pengajuanList, setPengajuanList] = useState([
    {
      id: "PJ-001",
      peminjam: "HMJ Biologi",
      item: "Proyektor (2 unit)",
      tanggal: "3 Agu 2026",
      durasi: "2 Hari",
      status: "Menunggu",
    },
    {
      id: "PJ-002",
      peminjam: "UKM Fotografi",
      item: "Ruang Seminar",
      tanggal: "4 Agu 2026",
      durasi: "3 Jam",
      status: "Menunggu",
    },
    {
      id: "PJ-003",
      peminjam: "BEM FMIPA",
      item: "Gedung AS Biologi",
      tanggal: "2 Agu 2026",
      durasi: "5 Jam",
      status: "Disetujui",
    },
    {
      id: "PJ-004",
      peminjam: "HMJ Kimia",
      item: "Sound System",
      tanggal: "7 Agu 2026",
      durasi: "1 Hari",
      status: "Disetujui",
    },
    {
      id: "PJ-005",
      peminjam: "UKM Musik",
      item: "Aula Utama",
      tanggal: "1 Agu 2026",
      durasi: "4 Jam",
      status: "Ditolak",
    },
    {
      id: "PJ-006",
      peminjam: "HMJ Fisika",
      item: "Kamera DSLR",
      tanggal: "6 Agu 2026",
      durasi: "2 Hari",
      status: "Menunggu",
    },
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setPengajuanList(
      pengajuanList.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tab Status */}
        <div className="flex items-center gap-2 bg-[#13232c] p-1 rounded-xl border border-[#213c4c]">
          {["Semua", "Menunggu", "Disetujui", "Ditolak"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                filterStatus === tab
                  ? "bg-[#257585] text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Cari peminjam atau item..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 bg-[#13232c] border border-[#213c4c] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Tabel Peminjaman */}
      <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#213c4c] text-slate-400 uppercase">
                <th className="py-3 px-3">No. Pengajuan</th>
                <th className="py-3 px-3">Peminjam</th>
                <th className="py-3 px-3">Item</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Durasi</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3340]">
              {pengajuanList
                .filter(
                  (item) =>
                    filterStatus === "Semua" || item.status === filterStatus,
                )
                .filter(
                  (item) =>
                    item.peminjam
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.item.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((item) => (
                  <tr key={item.id} className="hover:bg-[#192f3b]">
                    <td className="py-3 px-3 font-mono text-cyan-400 font-bold">
                      {item.id}
                    </td>
                    <td className="py-3 px-3 font-bold text-white">
                      {item.peminjam}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{item.item}</td>
                    <td className="py-3 px-3 text-slate-400">{item.tanggal}</td>
                    <td className="py-3 px-3 text-slate-400">{item.durasi}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === "Disetujui"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                            : item.status === "Menunggu"
                              ? "bg-amber-950 text-amber-300 border border-amber-800/50"
                              : "bg-rose-950 text-rose-300 border border-rose-800/50"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center space-x-1.5">
                      {item.status === "Menunggu" ? (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(item.id, "Disetujui")
                            }
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(item.id, "Ditolak")
                            }
                            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-[10px]"
                          >
                            Tolak
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() =>
                            alert(
                              `Detail Pengajuan ${item.id}:\nPeminjam: ${item.peminjam}\nItem: ${item.item}`,
                            )
                          }
                          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg text-[10px]"
                        >
                          Detail
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
