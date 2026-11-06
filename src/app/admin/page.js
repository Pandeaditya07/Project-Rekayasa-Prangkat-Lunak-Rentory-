"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  // State Data Master Admin
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

  const [inventarisList, setInventarisList] = useState([
    {
      kode: "INV-001",
      nama: "Proyektor Elektronik",
      kategori: "Elektronik",
      jumlah: 6,
      tersedia: 4,
      kondisi: "Baik",
    },
    {
      kode: "INV-002",
      nama: "Kursi Lipat",
      kategori: "Furnitur",
      jumlah: 120,
      tersedia: 120,
      kondisi: "Baik",
    },
    {
      kode: "INV-003",
      nama: "Sound System",
      kategori: "Elektronik",
      jumlah: 3,
      tersedia: 2,
      kondisi: "Baik",
    },
    {
      kode: "INV-004",
      nama: "Mikrofon Wireless",
      kategori: "Elektronik",
      jumlah: 8,
      tersedia: 5,
      kondisi: "Perlu perbaikan",
    },
    {
      kode: "INV-005",
      nama: "Meja Panjang",
      kategori: "Furnitur",
      jumlah: 30,
      tersedia: 24,
      kondisi: "Baik",
    },
    {
      kode: "INV-006",
      nama: "Kamera DSLR",
      kategori: "Elektronik",
      jumlah: 2,
      tersedia: 0,
      kondisi: "Baik",
    },
  ]);

  const [jadwalList, setJadwalList] = useState([
    {
      id: 1,
      tanggal: "Minggu, 2 Agu 2026",
      waktu: "12.00-17.00",
      gedung: "Gedung AS Biologi",
      kegiatan: "Rapat Umum Growth Class",
      peminjam: "BEM FMIPA",
      status: "Disetujui",
    },
    {
      id: 2,
      tanggal: "Rabu, 5 Agu 2026",
      waktu: "13.00-15.00",
      gedung: "Aula Utama",
      kegiatan: "Seminar Nasional",
      peminjam: "HMJ Biologi",
      status: "Menunggu",
    },
    {
      id: 3,
      tanggal: "Kamis, 6 Agu 2026",
      waktu: "08.00-10.00",
      gedung: "Ruang Seminar",
      kegiatan: "Rapat Koordinasi",
      peminjam: "BEM FMIPA",
      status: "Menunggu",
    },
    {
      id: 4,
      tanggal: "Jumat, 7 Agu 2026",
      waktu: "10.00-12.00",
      gedung: "Gedung AS Biologi",
      kegiatan: "Pelatihan Laboratorium",
      peminjam: "HMJ Kimia",
      status: "Disetujui",
    },
    {
      id: 5,
      tanggal: "Sabtu, 8 Agu 2026",
      waktu: "09.00-12.00",
      gedung: "Ruang Seminar",
      kegiatan: "Workshop Fotografi Dasar",
      peminjam: "UKM Fotografi",
      status: "Disetujui",
    },
  ]);

  const [pengembalianList, setPengembalianList] = useState([
    {
      id: 1,
      peminjam: "HMJ Biologi",
      item: "Proyektor (2 unit)",
      tglPinjam: "3 Agu 2026",
      batas: "5 Agu 2026",
      status: "Dipinjam",
    },
    {
      id: 2,
      peminjam: "UKM Musik",
      item: "Sound System",
      tglPinjam: "28 Jul 2026",
      batas: "30 Jul 2026",
      status: "Terlambat",
    },
    {
      id: 3,
      peminjam: "HMJ Kimia",
      item: "Mikrofon Wireless (2)",
      tglPinjam: "29 Jul 2026",
      batas: "31 Jul 2026",
      status: "Terlambat",
    },
    {
      id: 4,
      peminjam: "BEM FMIPA",
      item: "Kursi Lipat (40)",
      tglPinjam: "25 Jul 2026",
      batas: "26 Jul 2026",
      status: "Dikembalikan",
    },
    {
      id: 5,
      peminjam: "UKM Fotografi",
      item: "Kamera DSLR",
      tglPinjam: "20 Jul 2026",
      batas: "22 Jul 2026",
      status: "Dikembalikan",
    },
  ]);

  // State Filter & Search
  const [filterStatusPeminjaman, setFilterStatusPeminjaman] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showModalJadwal, setShowModalJadwal] = useState(false);
  const [showModalInventaris, setShowModalInventaris] = useState(false);

  // Modal Form Inputs
  const [newJadwal, setNewJadwal] = useState({
    tanggal: "",
    waktu: "",
    gedung: "Gedung AS Biologi",
    kegiatan: "",
    peminjam: "",
  });
  const [newInventaris, setNewInventaris] = useState({
    nama: "",
    kategori: "Elektronik",
    jumlah: "",
    kondisi: "Baik",
  });

  // Handlers Action
  const handleUpdateStatusPeminjaman = (id, newStatus) => {
    setPengajuanList(
      pengajuanList.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  const handleKonfirmasiKembali = (id) => {
    setPengembalianList(
      pengembalianList.map((item) =>
        item.id === id ? { ...item, status: "Dikembalikan" } : item,
      ),
    );
    alert("Barang inventaris telah dikonfirmasi berhasil dikembalikan!");
  };

  const handleAddJadwal = (e) => {
    e.preventDefault();
    setJadwalList([
      ...jadwalList,
      { ...newJadwal, id: Date.now(), status: "Disetujui" },
    ]);
    setShowModalJadwal(false);
    setNewJadwal({
      tanggal: "",
      waktu: "",
      gedung: "Gedung AS Biologi",
      kegiatan: "",
      peminjam: "",
    });
  };

  const handleAddInventaris = (e) => {
    e.preventDefault();
    const count = inventarisList.length + 1;
    const kodeStr = `INV-00${count}`;
    setInventarisList([
      ...inventarisList,
      {
        ...newInventaris,
        kode: kodeStr,
        tersedia: parseInt(newInventaris.jumlah),
        jumlah: parseInt(newInventaris.jumlah),
      },
    ]);
    setShowModalInventaris(false);
    setNewInventaris({
      nama: "",
      kategori: "Elektronik",
      jumlah: "",
      kondisi: "Baik",
    });
  };

  const handleDeleteInventaris = (kode) => {
    if (confirm(`Yakin ingin menghapus item ${kode}?`)) {
      setInventarisList(inventarisList.filter((item) => item.kode !== kode));
    }
  };

  const menuNavs = [
    {
      name: "Dashboard",
      svg: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z",
    },
    {
      name: "Jadwal Gedung",
      svg: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    { name: "Peminjaman", svg: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" },
    {
      name: "Kelola Inventaris",
      svg: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
    {
      name: "Pengembalian",
      svg: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b171d] text-slate-100 flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-[#12222a] border-r border-[#1a303b] flex flex-col justify-between shrink-0">
        <div>
          <div className="h-20 bg-[#1d5b68] flex items-center px-6 justify-between border-b border-[#246c7b]">
            <h1 className="text-3xl font-black text-white font-serif tracking-wide">
              Rentory
            </h1>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded font-bold">
              PORTAL ADMIN
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
                    setSearchQuery("");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition transform hover:translate-x-1.5 active:scale-95 ${
                    isActive
                      ? "bg-[#257585] text-white shadow-lg font-semibold border-l-4 border-cyan-300"
                      : "text-slate-400 hover:bg-[#182c36] hover:text-white"
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

        <div className="p-4 border-t border-[#1a303b]">
          <button
            onClick={() => router.push("/login")}
            className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-bold rounded-xl transition"
          >
            Keluar (Logout Admin)
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="h-20 bg-[#1d5b68] px-8 flex items-center justify-between border-b border-[#257282] shrink-0 sticky top-0 z-10 shadow-md">
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Halo Selamat Datang, Admin!
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-200 hidden sm:inline">
              Dekanat / Pengelola FMIPA
            </span>
            <div className="w-10 h-10 rounded-full bg-[#12222a] text-cyan-300 flex items-center justify-center font-bold border border-cyan-400 shadow">
              A
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {/* 1. DASHBOARD UTAMA */}
          {activeMenu === "Dashboard" && (
            <motion.main
              key="AdminDash"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-6 md:p-8 space-y-8"
            >
              <h1 className="text-2xl font-bold text-white">Dashboard Utama</h1>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-[#1f5c6b] p-5 rounded-2xl border border-cyan-500/20 shadow-xl">
                  <p className="text-xs font-semibold text-slate-200 uppercase">
                    Total Inventaris
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">48</p>
                  <p className="text-[11px] text-cyan-200 mt-0.5">
                    unit tercatat
                  </p>
                </div>
                <div className="bg-[#1f5c6b] p-5 rounded-2xl border border-cyan-500/20 shadow-xl">
                  <p className="text-xs font-semibold text-slate-200 uppercase">
                    Gedung & Ruang
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">14</p>
                  <p className="text-[11px] text-cyan-200 mt-0.5">tersedia</p>
                </div>
                <div className="bg-[#1f5c6b] p-5 rounded-2xl border border-cyan-500/20 shadow-xl">
                  <p className="text-xs font-semibold text-slate-200 uppercase">
                    Sedang Dipinjam
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">12</p>
                  <p className="text-[11px] text-cyan-200 mt-0.5">
                    unit keluar
                  </p>
                </div>
                <div className="bg-[#1f5c6b] p-5 rounded-2xl border border-cyan-500/20 shadow-xl">
                  <p className="text-xs font-semibold text-amber-200 uppercase">
                    Menunggu Persetujuan
                  </p>
                  <p className="text-3xl font-bold text-amber-300 mt-1">
                    {
                      pengajuanList.filter((i) => i.status === "Menunggu")
                        .length
                    }
                  </p>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">
                    pengajuan baru
                  </p>
                </div>
              </div>

              {/* Peminjaman Terbaru Grid Cards */}
              <div>
                <h3 className="text-lg font-bold text-white mb-4">
                  Peminjaman Terbaru
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-base font-bold text-cyan-300">
                        Gedung AS Biologi
                      </h4>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded font-bold">
                        DISAPPROVED
                      </span>
                    </div>
                    <p className="text-xs text-white font-semibold">
                      Rapat Umum Growth Class Udayana 2026
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-[#1b3340]">
                      <p>
                        Peminjam:{" "}
                        <span className="text-slate-200 font-medium">
                          BEM FMIPA
                        </span>
                      </p>
                      <p>
                        Hari/Tanggal:{" "}
                        <span className="text-slate-200 font-medium">
                          Minggu, 2 Agu 2026
                        </span>
                      </p>
                      <p>
                        Waktu:{" "}
                        <span className="text-slate-200 font-medium">
                          12.00-17.00 WITA
                        </span>
                      </p>
                      <p>
                        Durasi:{" "}
                        <span className="text-slate-200 font-medium">
                          300 Menit
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="text-base font-bold text-cyan-300">
                        Ruang Seminar
                      </h4>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/50 px-2 py-0.5 rounded font-bold">
                        APPROVED
                      </span>
                    </div>
                    <p className="text-xs text-white font-semibold">
                      Workshop Fotografi Dasar 2026
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-2 border-t border-[#1b3340]">
                      <p>
                        Peminjam:{" "}
                        <span className="text-slate-200 font-medium">
                          UKM Fotografi
                        </span>
                      </p>
                      <p>
                        Hari/Tanggal:{" "}
                        <span className="text-slate-200 font-medium">
                          Sabtu, 8 Agu 2026
                        </span>
                      </p>
                      <p>
                        Waktu:{" "}
                        <span className="text-slate-200 font-medium">
                          09.00-12.00 WITA
                        </span>
                      </p>
                      <p>
                        Durasi:{" "}
                        <span className="text-slate-200 font-medium">
                          180 Menit
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel Pengajuan Menunggu Persetujuan */}
              <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340] shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">
                  Pengajuan Menunggu Persetujuan
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#213c4c] text-slate-400 uppercase">
                        <th className="py-2.5 px-3">Peminjam</th>
                        <th className="py-2.5 px-3">Item</th>
                        <th className="py-2.5 px-3">Tanggal</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1b3340]">
                      {pengajuanList.filter((i) => i.status === "Menunggu")
                        .length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            className="py-6 text-center text-slate-500"
                          >
                            Tidak ada pengajuan yang menunggu persetujuan.
                          </td>
                        </tr>
                      ) : (
                        pengajuanList
                          .filter((i) => i.status === "Menunggu")
                          .map((item) => (
                            <tr key={item.id} className="hover:bg-[#192f3b]">
                              <td className="py-3 px-3 font-bold text-white">
                                {item.peminjam}
                              </td>
                              <td className="py-3 px-3 text-slate-300">
                                {item.item}
                              </td>
                              <td className="py-3 px-3 text-slate-400">
                                {item.tanggal}
                              </td>
                              <td className="py-3 px-3">
                                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/50 uppercase">
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-center space-x-2">
                                <button
                                  onClick={() =>
                                    handleUpdateStatusPeminjaman(
                                      item.id,
                                      "Disetujui",
                                    )
                                  }
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] transition"
                                >
                                  Setujui
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateStatusPeminjaman(
                                      item.id,
                                      "Ditolak",
                                    )
                                  }
                                  className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-[10px] transition"
                                >
                                  Tolak
                                </button>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.main>
          )}

          {/* 2. JADWAL GEDUNG */}
          {activeMenu === "Jadwal Gedung" && (
            <motion.main
              key="AdminJadwal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 md:p-8 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-white">Jadwal Gedung</h1>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Cari kegiatan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 bg-[#13232c] border border-[#213c4c] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => setShowModalJadwal(true)}
                    className="px-4 py-2 bg-[#257585] hover:bg-[#1f626f] text-white font-bold rounded-xl text-xs transition shadow-lg shrink-0"
                  >
                    + Tambah Jadwal
                  </button>
                </div>
              </div>

              {/* Cards Gedung Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Gedung AS Biologi
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Kapasitas 150 orang
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/50 rounded-lg text-xs font-bold">
                    Tersedia
                  </span>
                </div>
                <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Ruang Seminar
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Kapasitas 80 orang
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800/50 rounded-lg text-xs font-bold">
                    Terpakai hari ini
                  </span>
                </div>
                <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Aula Utama
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Kapasitas 300 orang
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/50 rounded-lg text-xs font-bold">
                    Tersedia
                  </span>
                </div>
              </div>

              {/* Tabel Agenda Minggu Ini */}
              <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340] shadow-xl">
                <h3 className="text-lg font-bold text-white mb-4">
                  Agenda Minggu Ini
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#213c4c] text-slate-400 uppercase">
                        <th className="py-3 px-3">Tanggal</th>
                        <th className="py-3 px-3">Waktu</th>
                        <th className="py-3 px-3">Gedung</th>
                        <th className="py-3 px-3">Kegiatan</th>
                        <th className="py-3 px-3">Peminjam</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1b3340]">
                      {jadwalList
                        .filter(
                          (j) =>
                            j.kegiatan
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            j.peminjam
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-[#192f3b]">
                            <td className="py-3 px-3 text-slate-300 font-medium">
                              {item.tanggal}
                            </td>
                            <td className="py-3 px-3 text-cyan-300 font-mono">
                              {item.waktu}
                            </td>
                            <td className="py-3 px-3 font-semibold text-white">
                              {item.gedung}
                            </td>
                            <td className="py-3 px-3 text-slate-200">
                              {item.kegiatan}
                            </td>
                            <td className="py-3 px-3 text-slate-400">
                              {item.peminjam}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  item.status === "Disetujui"
                                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                                    : "bg-amber-950 text-amber-300 border border-amber-800/50"
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

          {/* 3. PEMINJAMAN TABEL PERSETUJUAN */}
          {activeMenu === "Peminjaman" && (
            <motion.main
              key="AdminPeminjaman"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 md:p-8 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-[#13232c] p-1 rounded-xl border border-[#213c4c]">
                  {["Semua", "Menunggu", "Disetujui", "Ditolak"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilterStatusPeminjaman(tab)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                        filterStatusPeminjaman === tab
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
                            filterStatusPeminjaman === "Semua" ||
                            item.status === filterStatusPeminjaman,
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
                          <tr key={item.id} className="hover:bg-[#192f3b]">
                            <td className="py-3 px-3 font-mono text-cyan-400 font-bold">
                              {item.id}
                            </td>
                            <td className="py-3 px-3 font-bold text-white">
                              {item.peminjam}
                            </td>
                            <td className="py-3 px-3 text-slate-300">
                              {item.item}
                            </td>
                            <td className="py-3 px-3 text-slate-400">
                              {item.tanggal}
                            </td>
                            <td className="py-3 px-3 text-slate-400">
                              {item.durasi}
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
                                      handleUpdateStatusPeminjaman(
                                        item.id,
                                        "Disetujui",
                                      )
                                    }
                                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]"
                                  >
                                    Setujui
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUpdateStatusPeminjaman(
                                        item.id,
                                        "Ditolak",
                                      )
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
            </motion.main>
          )}

          {/* 4. KELOLA INVENTARIS */}
          {activeMenu === "Kelola Inventaris" && (
            <motion.main
              key="AdminInv"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 md:p-8 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-white">
                  Kelola Inventaris
                </h1>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Cari nama atau kode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 bg-[#13232c] border border-[#213c4c] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                  <button
                    onClick={() => setShowModalInventaris(true)}
                    className="px-4 py-2 bg-[#257585] hover:bg-[#1f626f] text-white font-bold rounded-xl text-xs transition shadow-lg shrink-0"
                  >
                    + Tambah Inventaris
                  </button>
                </div>
              </div>

              {/* Stat Inventaris */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Jenis Barang
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {inventarisList.length}
                  </p>
                  <p className="text-[11px] text-cyan-300 mt-0.5">terdaftar</p>
                </div>
                <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Total Unit
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {inventarisList.reduce((acc, curr) => acc + curr.jumlah, 0)}
                  </p>
                  <p className="text-[11px] text-cyan-300 mt-0.5">
                    seluruh kategori
                  </p>
                </div>
                <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md">
                  <p className="text-xs text-amber-200 font-semibold uppercase">
                    Perlu Perbaikan
                  </p>
                  <p className="text-3xl font-bold text-amber-300 mt-1">
                    {
                      inventarisList.filter(
                        (i) => i.kondisi === "Perlu perbaikan",
                      ).length
                    }
                  </p>
                  <p className="text-[11px] text-amber-200/80 mt-0.5">unit</p>
                </div>
              </div>

              {/* Tabel Inventaris */}
              <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340] shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#213c4c] text-slate-400 uppercase">
                        <th className="py-3 px-3">Kode</th>
                        <th className="py-3 px-3">Nama Barang</th>
                        <th className="py-3 px-3">Kategori</th>
                        <th className="py-3 px-3">Jumlah</th>
                        <th className="py-3 px-3">Tersedia</th>
                        <th className="py-3 px-3">Kondisi</th>
                        <th className="py-3 px-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1b3340]">
                      {inventarisList
                        .filter(
                          (item) =>
                            item.nama
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()) ||
                            item.kode
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((item) => (
                          <tr key={item.kode} className="hover:bg-[#192f3b]">
                            <td className="py-3 px-3 font-mono text-cyan-400 font-bold">
                              {item.kode}
                            </td>
                            <td className="py-3 px-3 font-bold text-white">
                              {item.nama}
                            </td>
                            <td className="py-3 px-3 text-slate-300">
                              {item.kategori}
                            </td>
                            <td className="py-3 px-3 text-slate-300 font-semibold">
                              {item.jumlah}
                            </td>
                            <td className="py-3 px-3 text-slate-300 font-semibold">
                              {item.tersedia}
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
                            <td className="py-3 px-3 text-center space-x-1.5">
                              <button
                                onClick={() => alert(`Edit ${item.nama}`)}
                                className="px-3 py-1 bg-cyan-800 hover:bg-cyan-700 text-white font-bold rounded-lg text-[10px]"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteInventaris(item.kode)
                                }
                                className="px-3 py-1 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px]"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.main>
          )}

          {/* 5. PENGEMBALIAN */}
          {activeMenu === "Pengembalian" && (
            <motion.main
              key="AdminPengembalian"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 md:p-8 space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-white">
                  Pengembalian Inventaris
                </h1>
                <input
                  type="text"
                  placeholder="Cari peminjam atau item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 bg-[#13232c] border border-[#213c4c] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Stat Pengembalian */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md">
                  <p className="text-xs text-slate-400 font-semibold uppercase">
                    Sedang Dipinjam
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {
                      pengembalianList.filter((i) => i.status === "Dipinjam")
                        .length
                    }
                  </p>
                  <p className="text-[11px] text-cyan-300 mt-0.5">
                    belum kembali
                  </p>
                </div>
                <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md">
                  <p className="text-xs text-rose-200 font-semibold uppercase">
                    Terlambat
                  </p>
                  <p className="text-3xl font-bold text-rose-400 mt-1">
                    {
                      pengembalianList.filter((i) => i.status === "Terlambat")
                        .length
                    }
                  </p>
                  <p className="text-[11px] text-rose-300 mt-0.5">
                    perlu ditindak
                  </p>
                </div>
                <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md">
                  <p className="text-xs text-emerald-200 font-semibold uppercase">
                    Dikembalikan
                  </p>
                  <p className="text-3xl font-bold text-emerald-300 mt-1">
                    {
                      pengembalianList.filter(
                        (i) => i.status === "Dikembalikan",
                      ).length
                    }
                  </p>
                  <p className="text-[11px] text-emerald-300 mt-0.5">
                    bulan ini
                  </p>
                </div>
              </div>

              {/* Tabel Status Pengembalian */}
              <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340] shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[#213c4c] text-slate-400 uppercase">
                        <th className="py-3 px-3">Peminjam</th>
                        <th className="py-3 px-3">Item</th>
                        <th className="py-3 px-3">Tgl. Pinjam</th>
                        <th className="py-3 px-3">Batas Kembali</th>
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
                            item.item
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase()),
                        )
                        .map((item) => (
                          <tr key={item.id} className="hover:bg-[#192f3b]">
                            <td className="py-3 px-3 font-bold text-white">
                              {item.peminjam}
                            </td>
                            <td className="py-3 px-3 text-slate-300">
                              {item.item}
                            </td>
                            <td className="py-3 px-3 text-slate-400">
                              {item.tglPinjam}
                            </td>
                            <td className="py-3 px-3 text-slate-400">
                              {item.batas}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                  item.status === "Dikembalikan"
                                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                                    : item.status === "Terlambat"
                                      ? "bg-rose-950 text-rose-300 border border-rose-800/50"
                                      : "bg-cyan-950 text-cyan-300 border border-cyan-800/50"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-center">
                              {item.status !== "Dikembalikan" ? (
                                <button
                                  onClick={() =>
                                    handleKonfirmasiKembali(item.id)
                                  }
                                  className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white font-bold rounded-lg text-[10px] transition"
                                >
                                  Konfirmasi Kembali
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    alert(`Pengembalian ${item.item} selesai.`)
                                  }
                                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-lg text-[10px]"
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
            </motion.main>
          )}
        </AnimatePresence>

        {/* MODAL: TAMBAH JADWAL */}
        {showModalJadwal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#13232c] border border-[#213c4c] p-6 rounded-2xl w-full max-w-md space-y-4">
              <h3 className="text-lg font-bold text-white">
                Tambah Jadwal Gedung Baru
              </h3>
              <form onSubmit={handleAddJadwal} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">
                    Nama Kegiatan
                  </label>
                  <input
                    type="text"
                    required
                    value={newJadwal.kegiatan}
                    onChange={(e) =>
                      setNewJadwal({ ...newJadwal, kegiatan: e.target.value })
                    }
                    className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">
                    Peminjam / Organisasi
                  </label>
                  <input
                    type="text"
                    required
                    value={newJadwal.peminjam}
                    onChange={(e) =>
                      setNewJadwal({ ...newJadwal, peminjam: e.target.value })
                    }
                    className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">
                    Pilih Gedung
                  </label>
                  <select
                    value={newJadwal.gedung}
                    onChange={(e) =>
                      setNewJadwal({ ...newJadwal, gedung: e.target.value })
                    }
                    className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                  >
                    <option value="Gedung AS Biologi">Gedung AS Biologi</option>
                    <option value="Ruang Seminar">Ruang Seminar</option>
                    <option value="Aula Utama">Aula Utama</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">Tanggal</label>
                    <input
                      type="text"
                      placeholder="Minggu, 2 Agu 2026"
                      required
                      value={newJadwal.tanggal}
                      onChange={(e) =>
                        setNewJadwal({ ...newJadwal, tanggal: e.target.value })
                      }
                      className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">Waktu</label>
                    <input
                      type="text"
                      placeholder="12.00-17.00"
                      required
                      value={newJadwal.waktu}
                      onChange={(e) =>
                        setNewJadwal({ ...newJadwal, waktu: e.target.value })
                      }
                      className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModalJadwal(false)}
                    className="flex-1 py-2 bg-slate-700 text-slate-200 font-bold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#257585] text-white font-bold rounded-xl"
                  >
                    Simpan Jadwal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: TAMBAH INVENTARIS */}
        {showModalInventaris && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#13232c] border border-[#213c4c] p-6 rounded-2xl w-full max-w-md space-y-4">
              <h3 className="text-lg font-bold text-white">
                Tambah Inventaris Baru
              </h3>
              <form
                onSubmit={handleAddInventaris}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-slate-300 mb-1">
                    Nama Barang
                  </label>
                  <input
                    type="text"
                    required
                    value={newInventaris.nama}
                    onChange={(e) =>
                      setNewInventaris({
                        ...newInventaris,
                        nama: e.target.value,
                      })
                    }
                    className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">
                      Kategori
                    </label>
                    <select
                      value={newInventaris.kategori}
                      onChange={(e) =>
                        setNewInventaris({
                          ...newInventaris,
                          kategori: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                    >
                      <option value="Elektronik">Elektronik</option>
                      <option value="Furnitur">Furnitur</option>
                      <option value="Audio">Audio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">
                      Jumlah Unit
                    </label>
                    <input
                      type="number"
                      required
                      value={newInventaris.jumlah}
                      onChange={(e) =>
                        setNewInventaris({
                          ...newInventaris,
                          jumlah: e.target.value,
                        })
                      }
                      className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Kondisi</label>
                  <select
                    value={newInventaris.kondisi}
                    onChange={(e) =>
                      setNewInventaris({
                        ...newInventaris,
                        kondisi: e.target.value,
                      })
                    }
                    className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                  >
                    <option value="Baik">Baik</option>
                    <option value="Perlu perbaikan">Perlu perbaikan</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModalInventaris(false)}
                    className="flex-1 py-2 bg-slate-700 text-slate-200 font-bold rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#257585] text-white font-bold rounded-xl"
                  >
                    Simpan Inventaris
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
