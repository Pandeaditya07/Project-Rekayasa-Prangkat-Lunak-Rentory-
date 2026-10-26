"use client";

import { useState } from "react";

export default function RentoryDashboard() {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [peminjamanCategory, setPeminjamanCategory] = useState(null); // 'inventaris' | 'ruang' | 'gedung'
  const [selectedDate, setSelectedDate] = useState(12);
  const [selectedOwner, setSelectedOwner] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    namaKegiatan: "",
    pilihanItem: "",
    tanggal: "",
    waktuMulai: "",
    waktuSelesai: "",
    fileSurat: null,
  });

  // Data Dummy Dashboard
  const activities = [
    {
      tanggal: "19 April 2026",
      user: "Pandeaditya",
      kegiatan: "Opening Growth Class Udayana 2026 - Aula Lecture Building",
      subtext: "BEM FMIPA - Komunikasi dan Informasi | Minggu, 26 Juli 2026",
      status: "ACC",
      statusBg: "bg-emerald-600 text-white",
    },
    {
      tanggal: "20 Juni 2026",
      user: "Pandeaditya",
      kegiatan: "Rapat Umum Growth Class Udayana 2026 - Gedung AS Biologi",
      subtext: "BEM FMIPA - Komunikasi dan Informasi | Minggu, 2 Agustus 2026",
      status: "Pending",
      statusBg: "bg-amber-600 text-white",
    },
    {
      tanggal: "22 April 2026",
      user: "Pandeaditya",
      kegiatan: "Rapat Teknis Growth Class Udayana 2026 - Denakat Lantai...",
      subtext: "BEM FMIPA - Komunikasi dan Informasi | Minggu, 2 Agustus 2026",
      status: "Rejected",
      statusBg: "bg-rose-600 text-white",
    },
  ];

  const events = [
    {
      tanggal: 12,
      nama: "Aula Widya Sabha",
      waktu: "08:00 - 14:00",
      status: "Terisi",
    },
    {
      tanggal: 12,
      nama: "Gedung AS Biologi",
      waktu: "15:00 - 18:00",
      status: "Terisi",
    },
    {
      tanggal: 15,
      nama: "Proyektor Epson EB-E500",
      waktu: "09:00 - 12:00",
      status: "Terisi",
    },
    {
      tanggal: 20,
      nama: "Ruang MIPA 2.4",
      waktu: "10:00 - 16:00",
      status: "Terisi",
    },
  ];

  const jadwalGedungList = [
    {
      id: 1,
      gedung: "Gedung AS Biologi",
      kegiatan: "Rapat Umum Growth Class Udayana 2026",
      peminjam: "BEM FMIPA",
      hariTanggal: "Minggu, 2 Agustus 2026",
      waktu: "12.00 - 17.00 WITA",
      durasi: "300 Menit",
    },
    {
      id: 2,
      gedung: "MIPA 2.4 Dekanat FMIPA",
      kegiatan: "Rapat Umum INVENTION",
      peminjam: "HIMAIF UDAYANA",
      hariTanggal: "Minggu, 2 Agustus 2026",
      waktu: "12.00 - 17.00 WITA",
      durasi: "300 Menit",
    },
    {
      id: 3,
      gedung: "Gedung AS Biologi",
      kegiatan: "Rapat Umum Pioneer PKM 2026",
      peminjam: "BEM FMIPA",
      hariTanggal: "Minggu, 2 Agustus 2026",
      waktu: "12.00 - 17.00 WITA",
      durasi: "300 Menit",
    },
    {
      id: 4,
      gedung: "MIPA 2.4 Dekanat FMIPA",
      kegiatan: "Rapat Umum Program Kerja Pyston",
      peminjam: "HIMAFI UDAYANA",
      hariTanggal: "Minggu, 2 Agustus 2026",
      waktu: "12.00 - 17.00 WITA",
      durasi: "300 Menit",
    },
  ];

  // Data Inventaris Berdasarkan Pengelola
  const inventarisList = [
    {
      id: 1,
      nama: "Proyektor Epson EB-500",
      pemilik: "Dekanat",
      status: "Tersedia",
      kode: "INV-DEK-001",
    },
    {
      id: 2,
      nama: "Sound System Portable",
      pemilik: "BEM",
      status: "Dipinjam",
      kode: "INV-BEM-002",
    },
    {
      id: 3,
      nama: "Microphone Wireless (2 Unit)",
      pemilik: "BEM",
      status: "Tersedia",
      kode: "INV-BEM-003",
    },
    {
      id: 4,
      nama: "Layar Proyektor Stand",
      pemilik: "HIMA",
      status: "Tersedia",
      kode: "INV-HIM-001",
    },
    {
      id: 5,
      nama: "Ruang MIPA 2.4",
      pemilik: "Dekanat",
      status: "Tersedia",
      kode: "RNG-DEK-204",
    },
    {
      id: 6,
      nama: "Gedung AS Biologi",
      pemilik: "Dekanat",
      status: "Dipinjam",
      kode: "GDG-DEK-001",
    },
    {
      id: 7,
      nama: "Kabel Roll 15 Meter",
      pemilik: "HIMA",
      status: "Tersedia",
      kode: "INV-HIM-002",
    },
    {
      id: 8,
      nama: "Meja Lipat Acara (5 Unit)",
      pemilik: "BEM",
      status: "Tersedia",
      kode: "INV-BEM-004",
    },
  ];

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Filter Inventaris
  const filteredInventaris = inventarisList.filter((item) => {
    const matchOwner =
      selectedOwner === "Semua" || item.pemilik === selectedOwner;
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.kode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchOwner && matchSearch;
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(
      `Pengajuan ${peminjamanCategory.toUpperCase()} berhasil dikirim! Menunggu konfirmasi admin.`,
    );
    setPeminjamanCategory(null);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScanResult({
        kode: "INV-BEM-002",
        nama: "Sound System Portable",
        peminjam: "Pandeaditya (BEM FMIPA)",
        status: "Berhasil Dikembalikan",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f171e] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-full md:w-64 bg-[#14232c] border-r border-[#1e323e] flex flex-col justify-between shrink-0">
        <div>
          <div className="h-20 bg-[#216778] flex items-center px-6">
            <h1 className="text-3xl font-black text-white tracking-wide font-serif">
              Rentory
            </h1>
          </div>

          <nav className="p-4 space-y-2">
            {[
              { name: "Dashboard", icon: "📊" },
              { name: "Jadwal Gedung", icon: "📅" },
              { name: "Peminjaman", icon: "🛍️" },
              { name: "Kelola Inventaris", icon: "📦" },
              { name: "Pengembalian", icon: "🔄" },
            ].map((menu) => (
              <button
                key={menu.name}
                onClick={() => {
                  setActiveMenu(menu.name);
                  if (menu.name !== "Peminjaman") setPeminjamanCategory(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition ${
                  activeMenu === menu.name
                    ? "bg-[#287487] text-white shadow-lg"
                    : "text-slate-400 hover:bg-[#1a2d38] hover:text-white"
                }`}
              >
                <span className="text-lg">{menu.icon}</span>
                <span>{menu.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* ================= CONTENT UTAMA ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Header Bar */}
        <header className="h-20 bg-[#216778] px-8 flex items-center justify-between border-b border-[#2b7e92] shrink-0">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            Halo Selamat Datang, Aditya!
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#14232c] text-white flex items-center justify-center font-bold border border-cyan-400">
              A
            </div>
          </div>
        </header>

        {/* ================= VIEW 1: DASHBOARD ================= */}
        {activeMenu === "Dashboard" && (
          <main className="p-6 md:p-8 space-y-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Dashboard Utama
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-[#236878] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 border border-cyan-500/20">
                  <p className="text-sm font-semibold text-slate-100 text-center">
                    Ketersediaan Gedung
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-white text-center">
                    12 Gedung
                  </p>
                </div>
                <div className="bg-[#236878] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 border border-cyan-500/20">
                  <p className="text-sm font-semibold text-slate-100 text-center">
                    Gedung Yang Dipinjam
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-white text-center">
                    2 Gedung
                  </p>
                </div>
                <div className="bg-[#236878] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 border border-cyan-500/20">
                  <p className="text-sm font-semibold text-slate-100 text-center">
                    Ketersediaan Inventaris
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-white text-center">
                    12 Unit
                  </p>
                </div>
                <div className="bg-[#236878] p-5 rounded-2xl shadow-xl flex flex-col justify-between h-36 border border-cyan-500/20">
                  <p className="text-sm font-semibold text-slate-100 text-center">
                    Inventaris Yang Dipinjam
                  </p>
                  <p className="text-3xl md:text-4xl font-bold text-white text-center">
                    5 Unit
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Tabel Aktivitas Terakhir */}
              <div className="lg:col-span-7 bg-[#15232c] p-6 rounded-2xl border border-[#1e3442] shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4">
                  Aktivitas Terakhir
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#233a4a] text-slate-400 text-xs uppercase tracking-wider">
                        <th className="py-3 px-2">Tanggal</th>
                        <th className="py-3 px-2">User</th>
                        <th className="py-3 px-2">Aktivitas</th>
                        <th className="py-3 px-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e323e] text-sm">
                      {activities.map((act, index) => (
                        <tr
                          key={index}
                          className="hover:bg-[#1a2c38] transition"
                        >
                          <td className="py-4 px-2 text-xs text-slate-300 font-medium whitespace-nowrap">
                            {act.tanggal}
                          </td>
                          <td className="py-4 px-2 text-xs text-slate-200 whitespace-nowrap flex items-center gap-1.5 mt-1">
                            <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px]">
                              👤
                            </span>
                            {act.user}
                          </td>
                          <td className="py-4 px-2">
                            <p className="font-bold text-white text-xs leading-snug">
                              {act.kegiatan}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {act.subtext}
                            </p>
                          </td>
                          <td className="py-4 px-2 text-center whitespace-nowrap">
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full inline-block min-w-[70px] ${act.statusBg}`}
                            >
                              {act.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Kalender Interaktif */}
              <div className="lg:col-span-5 bg-[#15232c] p-6 rounded-2xl border border-[#1e3442] shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Kalender Peminjaman
                  </h3>
                  <span className="text-xs font-semibold bg-[#216778] px-3 py-1 rounded-lg text-cyan-100">
                    Oktober 2026
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 font-semibold mb-2">
                  <span>Sn</span>
                  <span>Sl</span>
                  <span>Rb</span>
                  <span>Km</span>
                  <span>Jm</span>
                  <span>St</span>
                  <span>Mg</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {daysInMonth.map((day) => {
                    const hasEvent = events.some((e) => e.tanggal === day);
                    const isSelected = selectedDate === day;
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(day)}
                        className={`h-9 rounded-lg text-xs font-semibold flex flex-col items-center justify-center transition relative ${
                          isSelected
                            ? "bg-[#287487] text-white ring-2 ring-cyan-400"
                            : hasEvent
                              ? "bg-[#1f3747] text-cyan-300 border border-cyan-500/30"
                              : "bg-[#182a35] text-slate-400 hover:bg-[#203645]"
                        }`}
                      >
                        {day}
                        {hasEvent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute bottom-1"></span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 pt-4 border-t border-[#1e323e]">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Jadwal Terisi ({selectedDate} Oktober 2026)
                  </h4>
                  <div className="space-y-2">
                    {events
                      .filter((e) => e.tanggal === selectedDate)
                      .map((ev, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-[#1c303d] border-l-4 border-amber-500 rounded-r-lg text-xs flex justify-between items-center"
                        >
                          <div>
                            <p className="font-bold text-white">{ev.nama}</p>
                            <p className="text-slate-400 text-[11px]">
                              {ev.waktu}
                            </p>
                          </div>
                          <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                            {ev.status}
                          </span>
                        </div>
                      ))}
                    {!events.some((e) => e.tanggal === selectedDate) && (
                      <p className="text-xs text-slate-500 italic py-2">
                        Tidak ada peminjaman pada tanggal ini.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ================= VIEW 2: JADWAL GEDUNG ================= */}
        {activeMenu === "Jadwal Gedung" && (
          <main className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jadwalGedungList.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#216778] p-6 rounded-2xl shadow-xl text-center space-y-4 border border-cyan-400/20"
                >
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-white">
                      {item.gedung}
                    </h3>
                    <p className="text-xs font-semibold text-slate-100 mt-1">
                      {item.kegiatan}
                    </p>
                  </div>
                  <div className="text-xs space-y-1 text-slate-100 max-w-xs mx-auto text-left pl-6">
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 text-slate-200">
                        Peminjam
                      </span>
                      <span className="col-span-7 font-medium">
                        : {item.peminjam}
                      </span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 text-slate-200">
                        Hari/Tanggal
                      </span>
                      <span className="col-span-7 font-medium">
                        : {item.hariTanggal}
                      </span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 text-slate-200">Waktu</span>
                      <span className="col-span-7 font-medium">
                        : {item.waktu}
                      </span>
                    </div>
                    <div className="grid grid-cols-12">
                      <span className="col-span-5 text-slate-200">Durasi</span>
                      <span className="col-span-7 font-medium">
                        : {item.durasi}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ================= VIEW 3: PEMINJAMAN ================= */}
        {activeMenu === "Peminjaman" && (
          <main className="p-6 md:p-8 flex-1 flex flex-col items-center justify-center">
            {!peminjamanCategory ? (
              <div className="w-full max-w-md space-y-5 my-auto">
                {["INVENTARIS", "RUANG", "GEDUNG"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setPeminjamanCategory(cat.toLowerCase())}
                    className="w-full py-5 bg-[#216778] hover:bg-[#287487] text-white font-black text-xl tracking-wider rounded-3xl shadow-xl border border-cyan-400/30 transition transform hover:-translate-y-0.5"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            ) : (
              <form
                onSubmit={handleFormSubmit}
                className="w-full max-w-3xl bg-white text-slate-800 p-8 rounded-3xl shadow-2xl space-y-6 my-auto"
              >
                <div className="flex items-center justify-between border-b pb-4">
                  <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
                    Form Peminjaman {peminjamanCategory}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setPeminjamanCategory(null)}
                    className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg text-slate-600 font-semibold"
                  >
                    ← Pilih Kategori
                  </button>
                </div>

                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-600 mb-1">
                      Nama Kegiatan
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masukkan nama kegiatan..."
                      className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          namaKegiatan: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 mb-1">
                        Pilih {peminjamanCategory.toUpperCase()}
                      </label>
                      <select
                        required
                        className="w-full p-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-600"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pilihanItem: e.target.value,
                          })
                        }
                      >
                        <option value="">-- Pilih Option --</option>
                        {peminjamanCategory === "gedung" && (
                          <>
                            <option>Gedung AS Biologi</option>
                            <option>Aula Widya Sabha</option>
                          </>
                        )}
                        {peminjamanCategory === "ruang" && (
                          <>
                            <option>Ruang MIPA 2.4</option>
                            <option>Ruang Seminar Agri</option>
                          </>
                        )}
                        {peminjamanCategory === "inventaris" && (
                          <>
                            <option>Proyektor Epson EB-500</option>
                            <option>Sound System Portable</option>
                            <option>Microphone Wireless</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1">
                        Hari / Tanggal Peminjaman
                      </label>
                      <input
                        type="date"
                        required
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                        onChange={(e) =>
                          setFormData({ ...formData, tanggal: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-600 mb-1">
                        Waktu Peminjaman
                      </label>
                      <input
                        type="time"
                        required
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            waktuMulai: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 mb-1">
                        Waktu Pengembalian
                      </label>
                      <input
                        type="time"
                        required
                        className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            waktuSelesai: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">
                      Upload Surat Peminjaman
                    </label>
                    <input
                      type="file"
                      required
                      accept=".pdf"
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#216778] hover:bg-[#1a5361] text-white font-bold rounded-xl text-sm transition"
                  >
                    Ajukan Peminjaman
                  </button>
                  <button
                    type="button"
                    onClick={() => setPeminjamanCategory(null)}
                    className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-sm transition"
                  >
                    Batalkan
                  </button>
                </div>
              </form>
            )}
          </main>
        )}

        {/* ================= VIEW 4: KELOLA INVENTARIS ================= */}
        {activeMenu === "Kelola Inventaris" && (
          <main className="p-6 md:p-8 space-y-6">
            {/* Filter Pengelola (Dekanat, BEM, HIMA) & Search */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#14232c] p-4 rounded-2xl border border-[#1e323e]">
              <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
                {["Semua", "Dekanat", "BEM", "HIMA"].map((owner) => (
                  <button
                    key={owner}
                    onClick={() => setSelectedOwner(owner)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      selectedOwner === owner
                        ? "bg-[#216778] text-white shadow-md"
                        : "bg-[#1a2d38] text-slate-400 hover:bg-[#203645]"
                    }`}
                  >
                    Aset {owner}
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Cari nama atau kode inventaris..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 px-4 py-2 bg-[#1a2d38] border border-[#233a4a] text-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Grid Kartu Inventaris */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredInventaris.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#15232c] border border-[#1e323e] rounded-2xl p-5 flex flex-col justify-between shadow-lg space-y-3"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold bg-[#216778] text-cyan-100 px-2 py-0.5 rounded">
                        {item.pemilik}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.status === "Tersedia"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm">
                      {item.nama}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-1">
                      {item.kode}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveMenu("Peminjaman");
                      setPeminjamanCategory("inventaris");
                    }}
                    disabled={item.status !== "Tersedia"}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                      item.status === "Tersedia"
                        ? "bg-[#216778] hover:bg-[#287487] text-white"
                        : "bg-slate-800 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    {item.status === "Tersedia"
                      ? "Pinjam Aset"
                      : "Sedang Dipinjam"}
                  </button>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* ================= VIEW 5: PENGEMBALIAN (SCANNER) ================= */}
        {activeMenu === "Pengembalian" && (
          <main className="p-6 md:p-8 flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-xl bg-[#14232c] border border-[#1e323e] rounded-3xl p-8 text-center space-y-6 shadow-2xl my-auto">
              <div
                onClick={handleSimulateScan}
                className={`w-32 h-24 mx-auto border-4 border-dashed ${
                  isScanning
                    ? "border-amber-400 animate-pulse"
                    : "border-cyan-400"
                } rounded-2xl flex items-center justify-center text-4xl cursor-pointer hover:scale-105 transition bg-[#182a35]`}
              >
                {isScanning ? "⏳" : "📷"}
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">
                  Pemindai Barcode / QR Code
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Klik ikon kamera di atas untuk mensimulasikan pemindaian
                  pengembalian barang.
                </p>
              </div>

              {scanResult && (
                <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-left space-y-1 text-xs">
                  <p className="text-emerald-400 font-bold">
                    ✅ STATUS: {scanResult.status}
                  </p>
                  <p className="text-slate-200">
                    Item: <strong>{scanResult.nama}</strong> ({scanResult.kode})
                  </p>
                  <p className="text-slate-300">
                    Peminjam: {scanResult.peminjam}
                  </p>
                </div>
              )}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
