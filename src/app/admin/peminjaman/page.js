"use client";

import { useState, useEffect } from "react";

// Helper di luar komponen agar tidak memicu warning dependency di useEffect
const formatStatusLabel = (dbStatus) => {
  if (!dbStatus || dbStatus === "Pending" || dbStatus === "Menunggu")
    return "Menunggu";
  if (dbStatus === "Approved" || dbStatus === "Disetujui") return "Disetujui";
  if (dbStatus === "Rejected" || dbStatus === "Ditolak") return "Ditolak";
  return dbStatus;
};

const formatTanggalWaktu = (tglMulai, tglSelesai) => {
  if (!tglMulai) return { tanggal: "-", durasi: "-" };
  const start = new Date(tglMulai);
  const tanggal = start.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (!tglSelesai) return { tanggal, durasi: "-" };
  const end = new Date(tglSelesai);
  const jamMulai = start.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const jamSelesai = end.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    tanggal,
    durasi: `${jamMulai} - ${jamSelesai}`,
  };
};

export default function PeminjamanPage() {
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [pengajuanList, setPengajuanList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadPengajuan = async () => {
      try {
        const res = await fetch("/api/peminjaman");
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((row) => {
            const { tanggal, durasi } = formatTanggalWaktu(
              row.tgl_mulai,
              row.tgl_selesai,
            );
            return {
              id_db: row.id_peminjaman_ruang,
              id: `PJ-${String(row.id_peminjaman_ruang).padStart(3, "0")}`,
              peminjam:
                row.organisasi || row.peminjam || `User #${row.id_user}`,
              item:
                row.nama_kegiatan || row.nama_ruangan || row.nama_gedung || "-",
              tanggal,
              durasi,
              status: formatStatusLabel(row.status),
              file_surat: row.file_surat,
            };
          });
          setPengajuanList(mapped);
        }
      } catch (error) {
        console.error("Gagal memuat data peminjaman:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPengajuan();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateStatus = async (idDb, newLabelStatus) => {
    const dbStatusValue =
      newLabelStatus === "Disetujui" ? "Approved" : "Rejected";
    try {
      const res = await fetch("/api/peminjaman", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_peminjaman_ruang: idDb,
          status: dbStatusValue,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setPengajuanList((prev) =>
          prev.map((item) =>
            item.id_db === idDb ? { ...item, status: newLabelStatus } : item,
          ),
        );
      } else {
        alert(`Gagal memperbarui status: ${result.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi saat memperbarui status.");
      console.error(error);
    }
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
                <th className="py-3 px-3">Item / Kegiatan</th>
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-3 text-center">Surat</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3340]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-slate-400">
                    Memuat data pengajuan...
                  </td>
                </tr>
              ) : pengajuanList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-slate-400">
                    Belum ada pengajuan peminjaman.
                  </td>
                </tr>
              ) : (
                pengajuanList
                  .filter(
                    (item) =>
                      filterStatus === "Semua" || item.status === filterStatus,
                  )
                  .filter(
                    (item) =>
                      item.peminjam
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      item.item
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                  )
                  .map((item) => (
                    <tr key={item.id_db} className="hover:bg-[#192f3b]">
                      <td className="py-3 px-3 font-mono text-cyan-400 font-bold">
                        {item.id}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {item.peminjam}
                      </td>
                      <td className="py-3 px-3 text-slate-300">{item.item}</td>
                      <td className="py-3 px-3 text-slate-400">
                        {item.tanggal}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {item.durasi}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.file_surat ? (
                          <a
                            href={item.file_surat}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 rounded-lg text-[10px] font-bold inline-block transition"
                          >
                            Lihat PDF
                          </a>
                        ) : (
                          <span className="text-slate-500 text-[10px]">
                            Tidak ada
                          </span>
                        )}
                      </td>
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
                                handleUpdateStatus(item.id_db, "Disetujui")
                              }
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(item.id_db, "Ditolak")
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
                                `Detail Pengajuan ${item.id}:\nPeminjam: ${item.peminjam}\nItem: ${item.item}\nStatus: ${item.status}`,
                              )
                            }
                            className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-lg text-[10px]"
                          >
                            Detail
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
