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

const compressImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 800;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function UserPengembalianPage() {
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const [selectedItem, setSelectedItem] = useState(null);
  const [penerimaKembali, setPenerimaKembali] = useState("");
  const [fotoPreview, setFotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refreshData = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const idUser = savedUser.id_user || savedUser.id || savedUser.user_id;
      const url = idUser
        ? `/api/pengembalian?id_user=${idUser}`
        : `/api/pengembalian`;
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setListData(json.data);
      }
    } catch (error) {
      console.error("Gagal memuat ulang daftar pengembalian:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initLoad = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const idUser = savedUser.id_user || savedUser.id || savedUser.user_id;
        const nama = savedUser.nama || savedUser.username || "Peminjam";

        const url = idUser
          ? `/api/pengembalian?id_user=${idUser}`
          : `/api/pengembalian`;
        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();

        if (!isMounted) return;
        setUserName(nama);
        if (json.success && Array.isArray(json.data)) {
          setListData(json.data);
        }
      } catch (error) {
        console.error("Gagal memuat daftar pengembalian:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initLoad();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setPenerimaKembali("");
    setFotoPreview("");
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
    setPenerimaKembali("");
    setFotoPreview("");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedBase64 = await compressImageToBase64(file);
      setFotoPreview(compressedBase64);
    } catch (error) {
      alert("Gagal memproses foto kamera.");
      console.error(error);
    }
  };

  const handleSubmitPengembalian = async (e) => {
    e.preventDefault();
    if (!fotoPreview) {
      alert("Silakan ambil atau unggah foto dokumentasi pengembalian!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/pengembalian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_peminjaman_ruang: selectedItem.id_peminjaman_ruang,
          penerima_kembali: penerimaKembali,
          foto_pengembalian: fotoPreview,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert(result.message);
        handleCloseModal();
        refreshData();
      } else {
        alert(`Gagal mengirim: ${result.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Pengembalian Barang & Ruangan
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Daftar peminjaman yang telah disetujui dan siap untuk dikembalikan.
        </p>
      </div>

      {/* Tabel Daftar Peminjaman Aktif & Riwayat Pengembalian */}
      <div className="bg-[#0d2229] border border-[#15343d] rounded-2xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#1a3e47] text-slate-400 uppercase">
                <th className="py-3 px-3">Kode</th>
                <th className="py-3 px-3">Barang / Ruangan / Gedung</th>
                <th className="py-3 px-3">Tgl Pinjam</th>
                <th className="py-3 px-3">Penerima Kembali</th>
                <th className="py-3 px-3">Status Pengembalian</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#15343d]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    Memuat data peminjaman aktif...
                  </td>
                </tr>
              ) : listData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    Belum ada peminjaman yang disetujui untuk dikembalikan.
                  </td>
                </tr>
              ) : (
                listData.map((item) => (
                  <tr
                    key={item.id_peminjaman_ruang}
                    className="hover:bg-[#122e37]"
                  >
                    <td className="py-3.5 px-3 font-mono text-cyan-400 font-bold">
                      PJ-{String(item.id_peminjaman_ruang).padStart(3, "0")}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-white">
                      {item.nama_item}
                    </td>
                    <td className="py-3.5 px-3 text-slate-400">
                      {formatTanggal(item.tgl_mulai)}
                    </td>
                    <td className="py-3.5 px-3 text-slate-300">
                      {item.penerima_kembali || "-"}
                    </td>
                    <td className="py-3.5 px-3">
                      {item.status === "Approved" && (
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                          Sedang Dipinjam
                        </span>
                      )}
                      {item.status === "Menunggu Pengembalian" && (
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800/60">
                          Menunggu Konfirmasi Admin
                        </span>
                      )}
                      {item.status === "Selesai" && (
                        <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                          ✓ Sudah Dikonfirmasi Admin
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {item.status === "Approved" ? (
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="px-3.5 py-1.5 bg-[#18535e] hover:bg-[#1f6a78] text-white font-bold rounded-lg text-[11px] shadow transition"
                        >
                          Pengembalian
                        </button>
                      ) : item.status === "Menunggu Pengembalian" ? (
                        <span className="text-[11px] text-amber-300/80 italic">
                          Dicek Admin
                        </span>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          Selesai
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

      {/* Modal Form Pengembalian */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4">
          <div className="bg-[#0d2229] border border-[#1a3e47] rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1a3e47] pb-3">
              <h3 className="text-base font-bold text-white">
                Form Pengembalian
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmitPengembalian}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Item / Ruangan yang Dikembalikan
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedItem.nama_item}
                  className="w-full rounded-xl bg-[#071418] border border-[#1a3e47] px-3.5 py-2.5 text-cyan-300 font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Nama Peminjam
                </label>
                <input
                  type="text"
                  readOnly
                  value={selectedItem.nama_peminjam || userName}
                  className="w-full rounded-xl bg-[#071418] border border-[#1a3e47] px-3.5 py-2.5 text-slate-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Diterima Oleh (Nama Petugas / Admin)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pak Budi (Staff Perlengkapan)"
                  value={penerimaKembali}
                  onChange={(e) => setPenerimaKembali(e.target.value)}
                  className="w-full rounded-xl bg-[#071418] border border-[#1a3e47] px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">
                  Foto Dokumentasi Pengembalian (Kamera)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  required
                  onChange={handleFileChange}
                  className="w-full rounded-xl bg-[#071418] border border-[#1a3e47] px-3.5 py-2.5 text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#18535e] file:text-white hover:file:bg-[#206b79]"
                />
                {fotoPreview && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-[#1a3e47] bg-[#071418] p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fotoPreview}
                      alt="Preview Dokumentasi"
                      className="w-full max-h-48 object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[#18535e] hover:bg-[#1f6a78] text-white font-bold shadow disabled:opacity-50"
                >
                  {submitting ? "Mengirim..." : "Kirim Pengembalian"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
