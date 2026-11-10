"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ambil data dari API Route /api/peminjaman
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/peminjaman");
        const json = await res.json();
        if (json.success) {
          setPeminjaman(json.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <p className="animate-pulse text-lg">
          Memuat data dari database MySQL...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 text-slate-100">
      <h1 className="text-2xl font-bold mb-6">
        Persetujuan Peminjaman Ruangan
      </h1>

      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-xs uppercase text-slate-400">
            <tr>
              <th className="px-6 py-3">Peminjam / Ormawa</th>
              <th className="px-6 py-3">Kegiatan</th>
              <th className="px-6 py-3">Gedung / Ruangan</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {peminjaman.map((item) => (
              <tr key={item.id_peminjaman_ruang} className="hover:bg-slate-750">
                <td className="px-6 py-4 font-medium text-white">
                  {item.peminjam}
                  <span className="block text-xs text-slate-400">
                    {item.organisasi}
                  </span>
                </td>
                <td className="px-6 py-4">{item.nama_kegiatan}</td>
                <td className="px-6 py-4">
                  {item.nama_gedung} - {item.nama_ruangan || "Keseluruhan"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      item.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : item.status === "Rejected"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
