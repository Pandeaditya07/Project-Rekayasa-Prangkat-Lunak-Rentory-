"use client";
import { useState } from "react";

export default function PeminjamanPage() {
  const [kategori, setKategori] = useState(null);
  const [formData, setFormData] = useState({
    namaKegiatan: "",
    organisasi: "",
    itemGedung: "",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Pengajuan Peminjaman ${kategori} Berhasil Dikirim!`);
    setKategori(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white">Peminjaman Fasilitas</h2>

      {!kategori ? (
        /* Pilihan 3 Kategori Utama */
        <div className="bg-[#0d2229] border border-[#15343d] rounded-2xl p-8 shadow-xl text-center space-y-6">
          <p className="text-sm text-slate-300">
            Pilih kategori fasilitas yang ingin diajukan:
          </p>
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            {["INVENTARIS", "RUANG", "GEDUNG"].map((item) => (
              <button
                key={item}
                onClick={() => setKategori(item)}
                className="w-full py-4 bg-[#18535e] hover:bg-[#206977] text-white font-bold text-base rounded-xl transition shadow-lg border border-[#267786]"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Form Isian Peminjaman */
        <div className="bg-[#0d2229] border border-[#15343d] rounded-2xl p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-[#183d47] pb-4">
            <h3 className="text-lg font-bold text-white">
              Form Peminjaman - {kategori}
            </h3>
            <button
              onClick={() => setKategori(null)}
              className="text-xs text-slate-400 hover:text-white bg-[#133139] px-3 py-1.5 rounded-lg border border-[#1d4854]"
            >
              ← Kembali
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Nama Kegiatan
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: LKMM FMIPA 2026"
                value={formData.namaKegiatan}
                onChange={(e) =>
                  setFormData({ ...formData, namaKegiatan: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-[#071418] border border-[#183d47] rounded-xl text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Organisasi / Pemohon
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: BEM FMIPA"
                  value={formData.organisasi}
                  onChange={(e) =>
                    setFormData({ ...formData, organisasi: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[#071418] border border-[#183d47] rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Pilih Item / Gedung
                </label>
                <select
                  required
                  value={formData.itemGedung}
                  onChange={(e) =>
                    setFormData({ ...formData, itemGedung: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[#071418] border border-[#183d47] rounded-xl text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">-- Pilih Fasilitas --</option>
                  <option value="Gedung AS Biologi">Gedung AS Biologi</option>
                  <option value="Ruang Seminar FMIPA">
                    Ruang Seminar FMIPA
                  </option>
                  <option value="Aula Dekanat FMIPA">Aula Dekanat FMIPA</option>
                  <option value="Proyektor EPSON">Proyektor EPSON</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Tanggal Peminjaman
                </label>
                <input
                  type="date"
                  required
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[#071418] border border-[#183d47] rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Waktu Mulai
                </label>
                <input
                  type="time"
                  required
                  value={formData.waktuMulai}
                  onChange={(e) =>
                    setFormData({ ...formData, waktuMulai: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[#071418] border border-[#183d47] rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Waktu Selesai
                </label>
                <input
                  type="time"
                  required
                  value={formData.waktuSelesai}
                  onChange={(e) =>
                    setFormData({ ...formData, waktuSelesai: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-[#071418] border border-[#183d47] rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Upload Surat Permohonan (.PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                className="w-full text-slate-300 bg-[#071418] border border-[#183d47] rounded-xl p-2 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-[#18535e] file:text-white file:font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#18535e] hover:bg-[#206977] text-white font-bold rounded-xl transition shadow-lg mt-2"
            >
              Kirim Pengajuan Peminjaman
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
