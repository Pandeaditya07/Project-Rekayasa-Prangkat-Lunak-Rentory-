"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function UserDashboardPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [peminjamanCategory, setPeminjamanCategory] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    namaKegiatan: "",
    organisasi: "BEM FMIPA",
    itemGedung: "Gedung AS Biologi",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    keterangan: "",
    fileSurat: null,
  });

  const [riwayatPeminjaman, setRiwayatPeminjaman] = useState([
    {
      id: "PJ-101",
      nama: "Musyawarah Mahasiswa",
      kategori: "Gedung AS Biologi",
      tanggal: "10 Aug 2026",
      status: "Approved",
    },
    {
      id: "PJ-102",
      nama: "Workshop LKMM",
      kategori: "Ruang Seminar FMIPA",
      tanggal: "15 Aug 2026",
      status: "Pending",
    },
    {
      id: "PJ-103",
      nama: "Lomba Fotografi",
      kategori: "Proyektor (2 Unit)",
      tanggal: "02 Aug 2026",
      status: "Completed",
    },
  ]);

  const menuNavs = [
    {
      name: "Dashboard",
      svg: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    },
    {
      name: "Jadwal Gedung",
      svg: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      name: "Peminjaman",
      svg: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
    },
    {
      name: "Kelola Inventaris",
      svg: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
    {
      name: "Pengembalian",
      svg: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    },
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.namaKegiatan || !formData.tanggal) {
      alert("Mohon isi nama kegiatan dan tanggal peminjaman!");
      return;
    }

    const newPermintaan = {
      id: `PJ-${Math.floor(100 + Math.random() * 900)}`,
      nama: formData.namaKegiatan,
      kategori: formData.itemGedung,
      tanggal: formData.tanggal,
      status: "Pending",
    };

    setRiwayatPeminjaman([newPermintaan, ...riwayatPeminjaman]);
    alert("Pengajuan peminjaman berhasil dikirim! Menunggu persetujuan Admin.");
    setPeminjamanCategory(null);
    setActiveMenu("Dashboard");
  };

  return (
    <div className="min-h-screen bg-[#0d181e] text-slate-100 flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Sidebar User */}
      <aside className="w-full md:w-64 bg-[#122028] border-r border-[#1a2d38] flex flex-col justify-between shrink-0">
        <div>
          <div className="h-20 bg-[#1d5c6a] flex items-center px-6 justify-between border-b border-[#246e7f]">
            <h1 className="text-3xl font-black text-white font-serif tracking-wide">
              Rentory
            </h1>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded font-bold">
              PENGAJU
            </span>
          </div>

          <nav className="p-4 space-y-2">
            {menuNavs.map((menu) => {
              const isActive = activeMenu === menu.name;
              return (
                <button
                  key={menu.name}
                  onClick={() => {
                    setActiveMenu(menu.name);
                    if (menu.name !== "Peminjaman") setPeminjamanCategory(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition transform hover:translate-x-1.5 active:scale-95 ${
                    isActive
                      ? "bg-[#257384] text-white shadow-lg font-semibold border-l-4 border-cyan-300"
                      : "text-slate-400 hover:bg-[#182934] hover:text-white"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${isActive ? "text-cyan-300" : "text-slate-400"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d={menu.svg}
                    />
                  </svg>
                  <span>{menu.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-[#1a2d38]">
          <button
            onClick={() => router.push("/login")}
            className="w-full py-2.5 bg-[#172933] hover:bg-rose-900/40 hover:text-rose-300 text-slate-400 text-xs font-bold rounded-xl transition border border-[#213745]"
          >
            Keluar (Logout)
          </button>
        </div>
      </aside>

      {/* Main Content User */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-20 bg-[#1d5c6a] px-8 flex items-center justify-between border-b border-[#246e7f] shrink-0 sticky top-0 z-20 shadow-md">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Halo Selamat Datang, Pandeaditya!
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-cyan-100 font-semibold hidden sm:inline">
              BEM FMIPA (2208561001)
            </span>
            <div className="w-10 h-10 rounded-full bg-[#122028] text-cyan-300 flex items-center justify-center font-bold border border-cyan-400 shadow">
              U
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* MENU 1: DASHBOARD UTAMA */}
          {activeMenu === "Dashboard" && (
            <motion.main
              key="UserDash"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 md:p-8 space-y-6"
            >
              {/* Layout Atas: Map + Kalender */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visual Map Kampus FMIPA */}
                <div className="lg:col-span-2 bg-[#122028] p-5 rounded-2xl border border-[#1b2f3b] shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-cyan-400 mb-1">
                      PETA LOKASI KAMPUS FMIPA
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Area ketersediaan ruang dan gedung rapat capstone Rentory.
                    </p>
                  </div>
                  <div className="h-48 md:h-56 bg-[#0f1b22] rounded-xl border border-[#213745] flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-950/40 via-transparent to-teal-950/30" />
                    {/* SVG Map Grid Layout */}
                    <svg
                      className="w-full h-full opacity-30 stroke-cyan-500/40"
                      fill="none"
                    >
                      <pattern
                        id="grid"
                        width="30"
                        height="30"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 30 0 L 0 0 0 30"
                          fill="none"
                          strokeWidth="0.5"
                        />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                    <div className="absolute flex flex-wrap justify-center gap-3 p-4">
                      <span className="px-3 py-1.5 bg-[#257384] text-white text-xs font-bold rounded-lg shadow-md border border-cyan-400">
                        Gedung AS Biologi
                      </span>
                      <span className="px-3 py-1.5 bg-[#1a3543] text-slate-300 text-xs font-semibold rounded-lg border border-[#28485a]">
                        Ruang Seminar FMIPA
                      </span>
                      <span className="px-3 py-1.5 bg-[#1a3543] text-slate-300 text-xs font-semibold rounded-lg border border-[#28485a]">
                        Lab Komputer 1
                      </span>
                    </div>
                  </div>
                </div>

                {/* Widget Kalender */}
                <div className="bg-[#122028] p-5 rounded-2xl border border-[#1b2f3b] shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-white">
                      Kalender Agustus 2026
                    </h3>
                    <span className="text-[10px] bg-[#1a3543] text-cyan-300 px-2 py-0.5 rounded font-mono">
                      2026
                    </span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 mb-2">
                    <span>Mg</span>
                    <span>Sn</span>
                    <span>Sl</span>
                    <span>Rb</span>
                    <span>Km</span>
                    <span>Jm</span>
                    <span>St</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const isToday = day === 7;
                      const hasEvent = day === 10 || day === 15;
                      return (
                        <div
                          key={day}
                          className={`h-8 flex items-center justify-center rounded-lg font-mono transition ${
                            isToday
                              ? "bg-cyan-500 text-slate-950 font-bold shadow-lg"
                              : hasEvent
                                ? "bg-[#257384]/50 text-cyan-300 border border-cyan-500/40"
                                : "hover:bg-[#1b2f3b] text-slate-300"
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#1b434e] p-5 rounded-2xl border border-cyan-500/20 shadow-lg flex flex-col justify-between">
                  <p className="text-xs font-bold text-cyan-200 uppercase">
                    Ketersediaan Gedung
                  </p>
                  <p className="text-3xl font-extrabold text-white mt-2">
                    12 Gedung
                  </p>
                </div>
                <div className="bg-[#1b434e] p-5 rounded-2xl border border-cyan-500/20 shadow-lg flex flex-col justify-between">
                  <p className="text-xs font-bold text-cyan-200 uppercase">
                    Inventaris Tersedia
                  </p>
                  <p className="text-3xl font-extrabold text-white mt-2">
                    12 Unit
                  </p>
                </div>
                <div className="bg-[#1b434e] p-5 rounded-2xl border border-cyan-500/20 shadow-lg flex flex-col justify-between">
                  <p className="text-xs font-bold text-amber-200 uppercase">
                    Status Peminjaman
                  </p>
                  <p className="text-3xl font-extrabold text-amber-300 mt-2">
                    1 Pending
                  </p>
                </div>
                <div className="bg-[#1b434e] p-5 rounded-2xl border border-cyan-500/20 shadow-lg flex flex-col justify-between">
                  <p className="text-xs font-bold text-emerald-200 uppercase">
                    Disetujui
                  </p>
                  <p className="text-3xl font-extrabold text-emerald-300 mt-2">
                    2 Acara
                  </p>
                </div>
              </div>

              {/* Tabel Riwayat Pengajuan */}
              <div className="bg-[#122028] p-6 rounded-2xl border border-[#1b2f3b] shadow-xl">
                <h3 className="text-base font-bold text-white mb-4">
                  Riwayat Pengajuan Peminjaman Saya
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#1f3747] text-slate-400 uppercase">
                        <th className="py-3 px-3">ID</th>
                        <th className="py-3 px-3">Nama Kegiatan</th>
                        <th className="py-3 px-3">Item / Ruang</th>
                        <th className="py-3 px-3">Tanggal</th>
                        <th className="py-3 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#172733]">
                      {riwayatPeminjaman.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-[#172733]/60 transition"
                        >
                          <td className="py-3.5 px-3 font-mono text-cyan-400 font-bold">
                            {item.id}
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-white">
                            {item.nama}
                          </td>
                          <td className="py-3.5 px-3 text-slate-300">
                            {item.kategori}
                          </td>
                          <td className="py-3.5 px-3 text-slate-400">
                            {item.tanggal}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                                item.status === "Approved"
                                  ? "bg-emerald-950 text-emerald-300 border border-emerald-700/50"
                                  : item.status === "Pending"
                                    ? "bg-amber-950 text-amber-300 border border-amber-700/50"
                                    : "bg-slate-800 text-slate-400"
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
            </motion.main>
          )}

          {/* MENU 2: JADWAL GEDUNG */}
          {activeMenu === "Jadwal Gedung" && (
            <motion.main
              key="Jadwal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 md:p-8 space-y-6"
            >
              <h1 className="text-2xl font-bold text-white">
                Jadwal Pemakaian Gedung FMIPA
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    gedung: "Gedung AS Biologi",
                    acara: "Musyawarah Mahasiswa BEM",
                    waktu: "10 Agu 2026 (08.00 - 16.00)",
                    status: "Terpakai",
                  },
                  {
                    gedung: "Ruang Seminar Utama",
                    acara: "Seminar Nasional FMIPA",
                    waktu: "12 Agu 2026 (09.00 - 13.00)",
                    status: "Terpakai",
                  },
                  {
                    gedung: "Lab Komputer 1",
                    acara: "Praktikum Pemrograman",
                    waktu: "Setiap Senin & Rabu",
                    status: "Rutin",
                  },
                  {
                    gedung: "Aula Gedung Dekanat",
                    acara: "Tersedia untuk Pengajuan",
                    waktu: "Bebas",
                    status: "Tersedia",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#122028] p-5 rounded-2xl border border-[#1b2f3b] flex justify-between items-center shadow-lg"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-cyan-300">
                        {item.gedung}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        {item.acara}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {item.waktu}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${item.status === "Terpakai" ? "bg-rose-950 text-rose-300 border border-rose-800/50" : "bg-emerald-950 text-emerald-300 border border-emerald-800/50"}`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.main>
          )}

          {/* MENU 3: PEMINJAMAN (NAV + FORM PENGAJUAN) */}
          {activeMenu === "Peminjaman" && (
            <motion.main
              key="Peminjaman"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 md:p-8 space-y-6"
            >
              {!peminjamanCategory ? (
                /* Sub-pilihan Kategori */
                <div className="max-w-xl mx-auto space-y-6 text-center py-8">
                  <h1 className="text-2xl font-bold text-white">
                    Pilih Kategori Peminjaman
                  </h1>
                  <p className="text-xs text-slate-400">
                    Silakan pilih jenis fasilitas yang ingin diajukan.
                  </p>
                  <div className="flex flex-col gap-4">
                    {["INVENTARIS", "RUANG", "GEDUNG"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setPeminjamanCategory(cat)}
                        className="w-full py-4 bg-[#1b434e] hover:bg-[#257384] text-white font-bold text-lg rounded-2xl transition border border-cyan-500/30 shadow-xl active:scale-95"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Form Pengajuan Lengkap */
                <div className="max-w-2xl mx-auto bg-[#122028] p-6 md:p-8 rounded-3xl border border-[#1b2f3b] shadow-2xl space-y-6">
                  <div className="flex items-center justify-between border-b border-[#1d3340] pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Form Peminjaman {peminjamanCategory}
                      </h2>
                      <p className="text-xs text-cyan-400">
                        Isi detail pengajuan perizinan permohonan.
                      </p>
                    </div>
                    <button
                      onClick={() => setPeminjamanCategory(null)}
                      className="text-xs bg-[#1a2e38] hover:bg-[#253f4d] text-slate-300 px-3 py-1.5 rounded-lg border border-[#284758]"
                    >
                      ← Kembali
                    </button>
                  </div>

                  <form
                    onSubmit={handleFormSubmit}
                    className="space-y-4 text-xs"
                  >
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
                          setFormData({
                            ...formData,
                            namaKegiatan: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-slate-100 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Organisasi / Pemohon
                        </label>
                        <input
                          type="text"
                          value={formData.organisasi}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              organisasi: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-slate-100 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Pilih Item / Gedung
                        </label>
                        <select
                          value={formData.itemGedung}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              itemGedung: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-slate-100 focus:outline-none focus:border-cyan-400"
                        >
                          <option value="Gedung AS Biologi">
                            Gedung AS Biologi
                          </option>
                          <option value="Ruang Seminar FMIPA">
                            Ruang Seminar FMIPA
                          </option>
                          <option value="Aula Dekanat FMIPA">
                            Aula Dekanat FMIPA
                          </option>
                          <option value="Proyektor Elektronik">
                            Proyektor Elektronik
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Tanggal
                        </label>
                        <input
                          type="date"
                          required
                          value={formData.tanggal}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              tanggal: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-slate-100 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Waktu Mulai
                        </label>
                        <input
                          type="time"
                          value={formData.waktuMulai}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              waktuMulai: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-slate-100 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Waktu Selesai
                        </label>
                        <input
                          type="time"
                          value={formData.waktuSelesai}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              waktuSelesai: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-slate-100 focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Upload Surat Peminjaman (.PDF)
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        className="w-full text-slate-400 bg-[#0b151a] border border-[#213745] rounded-xl p-2 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:bg-[#257384] file:text-white file:font-semibold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#2cb5c8] hover:bg-[#2399aa] text-slate-950 font-bold text-sm rounded-xl transition shadow-xl mt-4 active:scale-95"
                    >
                      Kirim Pengajuan Peminjaman
                    </button>
                  </form>
                </div>
              )}
            </motion.main>
          )}

          {/* MENU 4: KELOLA INVENTARIS */}
          {activeMenu === "Kelola Inventaris" && (
            <motion.main
              key="Inventaris"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 md:p-8 space-y-6"
            >
              <h1 className="text-2xl font-bold text-white">
                Daftar Inventaris Tersedia
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    nama: "Proyektor EPSON HD",
                    kategori: "Elektronik",
                    stok: "4 Unit Tersedia",
                  },
                  {
                    nama: "Sound System Portable",
                    kategori: "Audio",
                    stok: "2 Unit Tersedia",
                  },
                  {
                    nama: "Kursi Lipat Chitose",
                    kategori: "Furnitur",
                    stok: "100 Unit Tersedia",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#122028] p-5 rounded-2xl border border-[#1b2f3b] shadow-md"
                  >
                    <h3 className="text-base font-bold text-white">
                      {item.nama}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Kategori: {item.kategori}
                    </p>
                    <span className="inline-block mt-3 px-3 py-1 bg-cyan-950 text-cyan-300 text-xs font-semibold rounded-md border border-cyan-800/40">
                      {item.stok}
                    </span>
                  </div>
                ))}
              </div>
            </motion.main>
          )}

          {/* MENU 5: PENGEMBALIAN */}
          {activeMenu === "Pengembalian" && (
            <motion.main
              key="Pengembalian"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 md:p-8 space-y-6 text-center py-12"
            >
              <div className="max-w-md mx-auto bg-[#122028] p-8 rounded-3xl border border-[#1b2f3b] shadow-xl space-y-4">
                <h2 className="text-xl font-bold text-white">
                  Status Pengembalian Aset
                </h2>
                <p className="text-xs text-slate-400">
                  Tidak ada item inventaris yang harus dikembalikan saat ini.
                </p>
                <div className="p-4 bg-[#0b151a] rounded-xl text-emerald-400 text-xs font-semibold border border-emerald-800/30">
                  ✓ Semua aset peminjaman sebelumnya telah dikembalikan dengan
                  lengkap.
                </div>
              </div>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
