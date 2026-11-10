"use client";

import { useState } from "react";

export default function PengembalianPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const [pengembalianList, setPengembalianList] = useState([
    {
      id: "RET-001",
      peminjam: "HMJ Biologi",
      item: "Proyektor (2 unit)",
      tglPinjam: "1 Agu 2026",
      tglKembali: "3 Agu 2026",
      kondisi: "Baik",
      status: "Sudah Kembali",
    },
    {
      id: "RET-002",
      peminjam: "BEM FMIPA",
      item: "Sound System",
      tglPinjam: "2 Agu 2026",
      tglKembali: "4 Agu 2026",
      kondisi: "Baik",
      status: "Sudah Kembali",
    },
    {
      id: "RET-003",
      peminjam: "UKM Fotografi",
      item: "Kamera DSLR",
      tglPinjam: "3 Agu 2026",
      tglKembali: "5 Agu 2026",
      kondisi: "Perlu Cek",
      status: "Proses Pengembalian",
    },
    {
      id: "RET-004",
      peminjam: "HMJ Kimia",
      item: "Mikrofon Wireless (2 unit)",
      tglPinjam: "4 Agu 2026",
      tglKembali: "6 Agu 2026",
      kondisi: "Baik",
      status: "Proses Pengembalian",
    },
  ]);

  const handleKonfirmasi = (id) => {
    setPengembalianList(
      pengembalianList.map((item) =>
        item.id === id
          ? { ...item, status: "Sudah Kembali", kondisi: "Baik" }
          : item,
      ),
    );
    alert(`Pengembalian ${id} telah dikonfirmasi!`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">
          Pengembalian Inventaris
        </h1>
        <input
          type="text"
          placeholder="Cari peminjam atau barang..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 bg-[#13232c] border border-[#213c4c] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Ringkasan Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md">
          <p className="text-xs font-semibold text-amber-200 uppercase">
            Menunggu Konfirmasi Pengembalian
          </p>
          <p className="text-3xl font-bold text-amber-300 mt-1">
            {
              pengembalianList.filter((i) => i.status === "Proses Pengembalian")
                .length
            }
          </p>
          <p className="text-[11px] text-amber-200/80 mt-0.5">
            unit perlu dicek
          </p>
        </div>
        <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md">
          <p className="text-xs font-semibold text-emerald-200 uppercase">
            Selesai Dikembalikan
          </p>
          <p className="text-3xl font-bold text-emerald-300 mt-1">
            {
              pengembalianList.filter((i) => i.status === "Sudah Kembali")
                .length
            }
          </p>
          <p className="text-[11px] text-emerald-200/80 mt-0.5">
            transaksi selesai
          </p>
        </div>
      </div>

      {/* Tabel Pengembalian */}
      <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#213c4c] text-slate-400 uppercase">
                <th className="py-3 px-3">Kode Retur</th>
                <th className="py-3 px-3">Peminjam</th>
                <th className="py-3 px-3">Barang / Item</th>
                <th className="py-3 px-3">Tgl Pinjam</th>
                <th className="py-3 px-3">Tgl Kembali</th>
                <th className="py-3 px-3">Kondisi</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3340]">
              {pengembalianList
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
                    <td className="py-3 px-3 text-slate-400">
                      {item.tglPinjam}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {item.tglKembali}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.kondisi === "Baik"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                            : "bg-amber-950 text-amber-300 border border-amber-800/50"
                        }`}
                      >
                        {item.kondisi}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.status === "Sudah Kembali"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                            : "bg-amber-950 text-amber-300 border border-amber-800/50"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {item.status === "Proses Pengembalian" ? (
                        <button
                          onClick={() => handleKonfirmasi(item.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] transition"
                        >
                          Konfirmasi Terima
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">
                          Selesai
                        </span>
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
