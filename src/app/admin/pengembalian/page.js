"use client";

import { useState, useEffect } from "react";

const formatTanggal = (tgl) => {
  if (!tgl) return "-";
  return new Date(tgl).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function PengembalianPage() {
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [pengembalianList, setPengembalianList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState(null);

  const refreshPengembalian = async () => {
    try {
      const res = await fetch("/api/pengembalian", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setPengembalianList(json.data);
      }
    } catch (error) {
      console.error("Gagal memuat ulang data pengembalian:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initLoad = async () => {
      try {
        const res = await fetch("/api/pengembalian", { cache: "no-store" });
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setPengembalianList(json.data);
        }
      } catch (error) {
        console.error("Gagal memuat data pengembalian:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initLoad();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleKonfirmasi = async (idDb) => {
    try {
      const res = await fetch("/api/pengembalian", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_peminjaman_ruang: idDb,
        }),
      });
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        setPreviewItem(null);
        refreshPengembalian();
      } else {
        alert(`Gagal konfirmasi: ${result.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi saat konfirmasi.");
      console.error(error);
    }
  };

  const countMenunggu = pengembalianList.filter(
    (i) => i.status === "Menunggu Pengembalian",
  ).length;
  const countSelesai = pengembalianList.filter(
    (i) => i.status === "Selesai",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter Tab Status */}
        <div className="flex flex-wrap items-center gap-2 bg-[#13232c] p-1 rounded-xl border border-[#213c4c]">
          {[
            { label: "Semua", value: "Semua" },
            { label: "Menunggu Konfirmasi", value: "Menunggu Pengembalian" },
            { label: "Sedang Dipinjam", value: "Approved" },
            { label: "Selesai", value: "Selesai" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterStatus(tab.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                filterStatus === tab.value
                  ? "bg-[#257585] text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
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

      {/* Ringkasan Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md">
          <p className="text-xs font-semibold text-amber-200 uppercase">
            Menunggu Konfirmasi Pengembalian
          </p>
          <p className="text-3xl font-bold text-amber-300 mt-1">
            {countMenunggu}
          </p>
          <p className="text-[11px] text-amber-200/80 mt-0.5">
            pengajuan siap dicek & di-ACC
          </p>
        </div>
        <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md">
          <p className="text-xs font-semibold text-emerald-200 uppercase">
            Selesai Dikembalikan
          </p>
          <p className="text-3xl font-bold text-emerald-300 mt-1">
            {countSelesai}
          </p>
          <p className="text-[11px] text-emerald-200/80 mt-0.5">
            transaksi telah dikonfirmasi
          </p>
        </div>
      </div>

      {/* Tabel Pengembalian */}
      <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#213c4c] text-slate-400 uppercase">
                <th className="py-3 px-3">Kode</th>
                <th className="py-3 px-3">Peminjam</th>
                <th className="py-3 px-3">Item / Ruangan</th>
                <th className="py-3 px-3">Tgl Pinjam</th>
                <th className="py-3 px-3">Penerima Kembali</th>
                <th className="py-3 px-3 text-center">Bukti Foto</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3340]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-slate-400">
                    Memuat data pengembalian...
                  </td>
                </tr>
              ) : pengembalianList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-6 text-center text-slate-400">
                    Belum ada data pengembalian.
                  </td>
                </tr>
              ) : (
                pengembalianList
                  .filter(
                    (item) =>
                      filterStatus === "Semua" || item.status === filterStatus,
                  )
                  .filter(
                    (item) =>
                      (item.organisasi || item.nama_peminjam || "")
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      (item.nama_item || "")
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                  )
                  .map((item) => (
                    <tr
                      key={item.id_peminjaman_ruang}
                      className="hover:bg-[#192f3b]"
                    >
                      <td className="py-3 px-3 font-mono text-cyan-400 font-bold">
                        PJ-{String(item.id_peminjaman_ruang).padStart(3, "0")}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {item.organisasi || item.nama_peminjam}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {item.nama_item}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {formatTanggal(item.tgl_mulai)}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {item.penerima_kembali || "-"}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.foto_pengembalian ? (
                          <button
                            onClick={() => setPreviewItem(item)}
                            className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/50 rounded-lg text-[10px] font-bold transition"
                          >
                            Lihat Foto
                          </button>
                        ) : (
                          <span className="text-slate-500 text-[10px]">
                            Belum ada
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.status === "Selesai"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                              : item.status === "Menunggu Pengembalian"
                                ? "bg-amber-950 text-amber-300 border border-amber-800/50"
                                : "bg-cyan-950 text-cyan-300 border border-cyan-800/50"
                          }`}
                        >
                          {item.status === "Approved"
                            ? "Sedang Dipinjam"
                            : item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {item.status === "Menunggu Pengembalian" ? (
                          <button
                            onClick={() =>
                              handleKonfirmasi(item.id_peminjaman_ruang)
                            }
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] transition"
                          >
                            Konfirmasi Terima
                          </button>
                        ) : item.status === "Selesai" ? (
                          <span className="text-[11px] text-emerald-400 font-semibold">
                            ✓ Terkonfirmasi
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            Belum Dikembalikan
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Preview Foto Dokumentasi Pengembalian */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="bg-[#13232c] border border-[#213c4c] rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#213c4c] pb-3">
              <h3 className="text-base font-bold text-white">
                Bukti Foto Pengembalian
              </h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p>
                <span className="text-slate-400">Item / Ruangan:</span>{" "}
                <strong className="text-white">{previewItem.nama_item}</strong>
              </p>
              <p>
                <span className="text-slate-400">Peminjam:</span>{" "}
                <strong className="text-white">
                  {previewItem.organisasi || previewItem.nama_peminjam}
                </strong>
              </p>
              <p>
                <span className="text-slate-400">Diterima Oleh:</span>{" "}
                <strong className="text-cyan-300">
                  {previewItem.penerima_kembali || "-"}
                </strong>
              </p>
            </div>

            <div className="rounded-xl overflow-hidden border border-[#213c4c] bg-[#09151a] p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewItem.foto_pengembalian}
                alt="Bukti Pengembalian"
                className="w-full max-h-80 object-contain rounded-lg"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold"
              >
                Tutup
              </button>
              {previewItem.status === "Menunggu Pengembalian" && (
                <button
                  onClick={() =>
                    handleKonfirmasi(previewItem.id_peminjaman_ruang)
                  }
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow"
                >
                  Konfirmasi Pengembalian
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
