"use client";

import { useState, useEffect } from "react";

export default function UserPeminjamanPage() {
  // 3 menu kategori terpisah: "gedung", "ruangan", "inventaris"
  const [kategori, setKategori] = useState("gedung");
  const [fasilitas, setFasilitas] = useState("");
  const [namaKegiatan, setNamaKegiatan] = useState("");
  const [organisasi, setOrganisasi] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [waktuMulai, setWaktuMulai] = useState("");
  const [waktuSelesai, setWaktuSelesai] = useState("");
  const [fileSurat, setFileSurat] = useState(null);
  const [loading, setLoading] = useState(false);

  // Data live dari database MySQL
  const [gedungOptions, setGedungOptions] = useState([]);
  const [ruanganOptions, setRuanganOptions] = useState([]);
  const [inventarisOptions, setInventarisOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMasterData = async () => {
      try {
        const [resPeminjaman, resInventaris] = await Promise.all([
          fetch("/api/peminjaman", { cache: "no-store" }),
          fetch("/api/inventaris", { cache: "no-store" }),
        ]);

        const jsonPeminjaman = await resPeminjaman.json();
        const jsonInventaris = await resInventaris.json();

        if (!isMounted) return;

        // 1. Daftar Gedung dari Admin
        if (Array.isArray(jsonPeminjaman.gedungList)) {
          setGedungOptions(
            jsonPeminjaman.gedungList.map((g) => {
              const detail = [
                g.kapasitas ? `Kap. ${g.kapasitas} org` : null,
                g.fasilitas && g.fasilitas !== "-" ? g.fasilitas : null,
              ]
                .filter(Boolean)
                .join(" • ");

              return {
                id_gedung: g.id_gedung,
                nama: g.nama_gedung,
                label: detail ? `${g.nama_gedung} (${detail})` : g.nama_gedung,
              };
            }),
          );
        }

        // 2. Daftar Ruangan dari Admin
        if (Array.isArray(jsonPeminjaman.ruanganList)) {
          setRuanganOptions(
            jsonPeminjaman.ruanganList.map((r) => {
              const detail = [
                r.kapasitas ? `Kap. ${r.kapasitas} org` : null,
                r.fasilitas && r.fasilitas !== "-" ? r.fasilitas : null,
              ]
                .filter(Boolean)
                .join(" • ");

              return {
                id_ruangan: r.id_ruangan,
                id_gedung: r.id_gedung || "",
                nama: r.nama_ruangan,
                label: detail
                  ? `${r.nama_ruangan} (${detail})`
                  : r.nama_ruangan,
              };
            }),
          );
        }

        // 3. Daftar Barang Inventaris dari Admin
        if (jsonInventaris.success && Array.isArray(jsonInventaris.data)) {
          setInventarisOptions(
            jsonInventaris.data.map((item) => {
              const stok =
                item.jumlah === null || item.jumlah === undefined
                  ? null
                  : Number(item.jumlah);
              const namaBarang =
                item.nama_inventaris ||
                item.nama_barang ||
                item.nama ||
                "Barang";
              return {
                id_inventaris: item.id_inventaris,
                nama: namaBarang,
                kategori: item.kategori || "Umum",
                stok,
                label:
                  stok === null
                    ? `${namaBarang} (${item.kategori || "Umum"})`
                    : `${namaBarang} (${item.kategori || "Umum"}) - Tersedia: ${stok} unit`,
              };
            }),
          );
        }
      } catch (error) {
        console.error("Gagal memuat daftar fasilitas:", error);
      } finally {
        if (isMounted) setLoadingOptions(false);
      }
    };

    loadMasterData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectMenu = (menu) => {
    setKategori(menu);
    setFasilitas("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const idUser = savedUser.id_user || savedUser.id || savedUser.user_id;

      if (!idUser) {
        alert(
          "Sesi akun tidak ditemukan. Silakan login ulang terlebih dahulu.",
        );
        setLoading(false);
        return;
      }

      const tglMulai = `${tanggal} ${waktuMulai}:00`;
      const tglSelesai = `${tanggal} ${waktuSelesai}:00`;

      const formData = new FormData();
      formData.append("id_user", idUser);
      formData.append("tgl_mulai", tglMulai);
      formData.append("tgl_selesai", tglSelesai);

      if (kategori === "gedung") {
        formData.append("id_gedung", fasilitas);
        formData.append(
          "nama_kegiatan",
          `${namaKegiatan} (${organisasi || "Mahasiswa"})`,
        );
      } else if (kategori === "ruangan") {
        const selectedRuang = ruanganOptions.find(
          (r) => String(r.id_ruangan) === String(fasilitas),
        );
        if (selectedRuang?.id_gedung) {
          formData.append("id_gedung", selectedRuang.id_gedung);
        }
        formData.append("id_ruangan", fasilitas);
        formData.append(
          "nama_kegiatan",
          `${namaKegiatan} (${organisasi || "Mahasiswa"})`,
        );
      } else {
        const selectedInv = inventarisOptions.find(
          (i) => String(i.id_inventaris) === String(fasilitas),
        );
        const namaBarang = selectedInv ? selectedInv.nama : fasilitas;
        formData.append(
          "nama_kegiatan",
          `[INVENTARIS] ${namaBarang} - ${namaKegiatan} (${organisasi || "Mahasiswa"})`,
        );
      }

      if (fileSurat) {
        formData.append("file_surat", fileSurat);
      }

      const res = await fetch("/api/peminjaman", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Pengajuan peminjaman berhasil dikirim dan menunggu ACC Admin!");
        setFasilitas("");
        setNamaKegiatan("");
        setOrganisasi("");
        setTanggal("");
        setWaktuMulai("");
        setWaktuSelesai("");
        setFileSurat(null);
      } else {
        alert(`Gagal mengajukan: ${data.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white tracking-tight">
        Form Pengajuan Peminjaman
      </h2>

      {/* 3 Menu Pilihan Kategori Seperti Semula */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
        <button
          type="button"
          onClick={() => handleSelectMenu("gedung")}
          className={`p-4 rounded-2xl border text-left transition shadow-md ${
            kategori === "gedung"
              ? "bg-[#18535e] border-cyan-400 text-white"
              : "bg-[#0d2229] border-[#15343d] text-slate-300 hover:border-[#235663]"
          }`}
        >
          <p className="text-sm font-bold">Peminjaman Gedung</p>
          <p className="text-[11px] text-cyan-100/75 mt-1">
            Ajukan peminjaman gedung utama atau aula
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleSelectMenu("ruangan")}
          className={`p-4 rounded-2xl border text-left transition shadow-md ${
            kategori === "ruangan"
              ? "bg-[#18535e] border-cyan-400 text-white"
              : "bg-[#0d2229] border-[#15343d] text-slate-300 hover:border-[#235663]"
          }`}
        >
          <p className="text-sm font-bold">Peminjaman Ruangan</p>
          <p className="text-[11px] text-cyan-100/75 mt-1">
            Ajukan peminjaman ruang kelas atau ruang seminar
          </p>
        </button>

        <button
          type="button"
          onClick={() => handleSelectMenu("inventaris")}
          className={`p-4 rounded-2xl border text-left transition shadow-md ${
            kategori === "inventaris"
              ? "bg-[#18535e] border-cyan-400 text-white"
              : "bg-[#0d2229] border-[#15343d] text-slate-300 hover:border-[#235663]"
          }`}
        >
          <p className="text-sm font-bold">Peminjaman Inventaris</p>
          <p className="text-[11px] text-cyan-100/75 mt-1">
            Ajukan peminjaman barang & perlengkapan acara
          </p>
        </button>
      </div>

      {/* Card Form Pengajuan */}
      <div className="bg-[#0d2229] border border-[#15343d] rounded-2xl p-8 shadow-xl max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-2">
              {kategori === "gedung"
                ? "Pilih Gedung"
                : kategori === "ruangan"
                  ? "Pilih Ruangan"
                  : "Pilih Barang Inventaris"}
            </label>
            <select
              value={fasilitas}
              onChange={(e) => setFasilitas(e.target.value)}
              required
              className="w-full rounded-xl bg-[#071418] border border-[#1a3e47] px-4 py-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">
                {loadingOptions
                  ? "Memuat data dari database..."
                  : kategori === "gedung"
                    ? "-- Pilih Gedung --"
                    : kategori === "ruangan"
                      ? "-- Pilih Ruangan --"
                      : "-- Pilih Barang Inventaris --"}
              </option>

              {kategori === "gedung" &&
                gedungOptions.map((g) => (
                  <option key={g.id_gedung} value={g.id_gedung}>
                    {g.label}
                  </option>
                ))}

              {kategori === "ruangan" &&
                ruanganOptions.map((r) => (
                  <option key={r.id_ruangan} value={r.id_ruangan}>
                    {r.label}
                  </option>
                ))}

              {kategori === "inventaris" &&
                inventarisOptions.map((inv) => (
                  <option
                    key={inv.id_inventaris}
                    value={inv.id_inventaris}
                    disabled={inv.stok !== null && inv.stok <= 0}
                  >
                    {inv.stok !== null && inv.stok <= 0
                      ? `${inv.nama} (${inv.kategori}) - Stok Habis`
                      : inv.label}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-2">
              Nama Kegiatan
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: LKMM FMIPA 2026"
              value={namaKegiatan}
              onChange={(e) => setNamaKegiatan(e.target.value)}
              className="w-full rounded-xl bg-[#071418] border border-[#1a3e47] px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-2">
              Organisasi / Pemohon
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: BEM FMIPA"
              value={organisasi}
              onChange={(e) => setOrganisasi(e.target.value)}
              className="w-full rounded-xl bg-[#071418] border border-[#1a3e47] px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block font-semibold text-slate-300 mb-2">
                Tanggal Peminjaman
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full rounded-xl bg-[#071418] border border-[#1a3e47] px-4 py-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-2">
                Waktu Mulai
              </label>
              <input
                type="time"
                required
                value={waktuMulai}
                onChange={(e) => setWaktuMulai(e.target.value)}
                className="w-full rounded-xl bg-[#071418] border border-[#1a3e47] px-4 py-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-2">
                Waktu Selesai
              </label>
              <input
                type="time"
                required
                value={waktuSelesai}
                onChange={(e) => setWaktuSelesai(e.target.value)}
                className="w-full rounded-xl bg-[#071418] border border-[#1a3e47] px-4 py-3 text-slate-200 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-2">
              Upload Surat Permohonan (.PDF)
            </label>
            <input
              type="file"
              accept=".pdf"
              required
              onChange={(e) => setFileSurat(e.target.files[0])}
              className="w-full rounded-xl bg-[#071418] border border-[#1a3e47] px-4 py-3 text-slate-400 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#18535e] file:text-white hover:file:bg-[#206b79]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#18535e] hover:bg-[#1f6a78] py-3.5 text-sm font-bold text-white shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Mengirim Pengajuan..." : "Kirim Pengajuan Peminjaman"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
