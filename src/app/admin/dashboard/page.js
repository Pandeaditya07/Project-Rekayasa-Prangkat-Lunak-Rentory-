"use client";

import React, { useState } from "react";

export default function AdminDashboardPage() {
  // State data utama peminjaman
  const [activities, setActivities] = useState([
    {
      id: 1,
      tanggal: "19 April 2026",
      user: "Pandeaditya",
      aktivitas: "Opening Growth Class Udayana 2026 - Aula Lecture Building",
      subtext: "BEM FMIPA - Komunikasi dan Informasi | Minggu, 26 Juli 2026",
      status: "ACC",
      kategori: "Gedung",
    },
    {
      id: 2,
      tanggal: "20 Juni 2026",
      user: "Pandeaditya",
      aktivitas: "Rapat Umum Growth Class Udayana 2026 - Gedung AS Biologi",
      subtext: "BEM FMIPA - Komunikasi dan Informasi | Minggu, 2 Agustus 2026",
      status: "Pending",
      kategori: "Gedung",
    },
    {
      id: 3,
      tanggal: "22 April 2026",
      user: "Pandeaditya",
      aktivitas: "Rapat Teknis Growth Class Udayana 2026 - Denakat Lantai 3",
      subtext: "BEM FMIPA - Komunikasi dan Informasi | Minggu, 2 Agustus 2026",
      status: "Rejected",
      kategori: "Inventaris",
    },
  ]);

  // Handler Ubah Status Peminjaman (ACC / Tolak)
  const handleStatusChange = (id, newStatus) => {
    setActivities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus } : item,
      ),
    );
  };

  // Kalkulasi statistik dinamis berdasarkan state
  const totalGedungDipinjam = activities.filter(
    (a) => a.kategori === "Gedung" && a.status === "ACC",
  ).length;

  const totalInventarisDipinjam = activities.filter(
    (a) => a.kategori === "Inventaris" && a.status === "ACC",
  ).length;

  const stats = [
    { title: "Ketersediaan Gedung", value: "12 Gedung" },
    { title: "Gedung Yang Dipinjam", value: `${totalGedungDipinjam} Gedung` },
    { title: "Ketersediaan Inventaris", value: "12 Unit" },
    {
      title: "Inventaris Yang Dipinjam",
      value: `${totalInventarisDipinjam} Unit`,
    },
  ];

  return (
    <div className="space-y-6 text-slate-100 p-2">
      {/* Top Banner Greetings */}
      <div className="bg-[#205d69] border border-[#2b7b8b]/50 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Halo Selamat Datang, Admin!
        </h1>
        <p className="text-xs text-cyan-100 mt-1">
          Pantau ketersediaan gedung/inventaris dan setujui pengajuan peminjaman
          mahasiswa di sini.
        </p>
      </div>

      <h2 className="text-xl font-bold text-white tracking-wide pt-2">
        Dashboard Utama
      </h2>

      {/* Grid Stat Cards & Full Mini Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Stat Cards Container */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#205d69]/60 border border-[#2b7b8b]/40 rounded-2xl p-5 flex flex-col justify-between shadow-lg shadow-black/20 hover:border-cyan-500/50 transition duration-200"
            >
              <p className="text-xs text-cyan-100 font-semibold leading-snug">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-white mt-4 tracking-tight">
                {stat.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Mini Calendar Widget Presisi Sesuai Desain */}
        <div className="bg-[#11232d] border border-[#1d3847] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-300">
            <button className="hover:text-cyan-400 p-1">&lt;</button>
            <span className="tracking-wide">April 2026</span>
            <button className="hover:text-cyan-400 p-1">&gt;</button>
          </div>
          <div className="grid grid-cols-7 text-center text-[10px] text-slate-400 gap-y-2 font-mono">
            <span className="font-semibold text-slate-500">Lu</span>
            <span className="font-semibold text-slate-500">Mr</span>
            <span className="font-semibold text-slate-500">Du</span>
            <span className="font-semibold text-slate-500">Dr</span>
            <span className="font-semibold text-slate-500">Vo</span>
            <span className="font-semibold text-slate-500">Se</span>
            <span className="font-semibold text-slate-500">Mo</span>

            <span className="text-slate-600">28</span>
            <span className="text-slate-600">29</span>
            <span className="text-slate-600">30</span>
            <span>1</span>
            <span>2</span>
            <span className="font-bold text-white">3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span className="bg-cyan-500 text-slate-950 font-bold rounded-full w-5 h-5 flex items-center justify-center mx-auto shadow-md shadow-cyan-500/50">
              8
            </span>
            <span>9</span>
            <span>10</span>
            <span>11</span>
            <span>12</span>
            <span>13</span>
            <span>14</span>
            <span>15</span>
            <span>16</span>
            <span>17</span>
            <span>18</span>
            <span>19</span>
            <span>20</span>
            <span>21</span>
            <span>22</span>
            <span>23</span>
            <span>24</span>
            <span>25</span>
            <span>26</span>
            <span>27</span>
            <span>28</span>
            <span>29</span>
            <span>30</span>
            <span>31</span>
            <span className="text-slate-600">1</span>
          </div>
        </div>
      </div>

      {/* Tabel Persetujuan Peminjaman Admin */}
      <div className="bg-[#11232d]/90 border border-[#1d3847] rounded-2xl p-5 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">
          Aktivitas Terakhir & Kelola Status
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1d3847] text-slate-400">
                <th className="pb-3 font-semibold">Tanggal</th>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Aktivitas</th>
                <th className="pb-3 font-semibold text-center">
                  Status Saat Ini
                </th>
                <th className="pb-3 font-semibold text-right">
                  Aksi Persetujuan
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1d3847]/50">
              {activities.map((item) => (
                <tr key={item.id} className="hover:bg-[#18303e]/40 transition">
                  <td className="py-3.5 text-slate-300 font-medium whitespace-nowrap">
                    {item.tanggal}
                  </td>
                  <td className="py-3.5 text-slate-300 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#1e4252] text-cyan-400 flex items-center justify-center text-[10px] border border-cyan-500/30">
                        👤
                      </div>
                      <span>{item.user}</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <p className="font-semibold text-white">{item.aktivitas}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {item.subtext}
                    </p>
                  </td>
                  <td className="py-3.5 text-center">
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                        item.status === "ACC"
                          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                          : item.status === "Rejected"
                            ? "bg-rose-600 text-white shadow-md shadow-rose-600/20"
                            : "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStatusChange(item.id, "ACC")}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] transition shadow"
                      >
                        ✓ ACC
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, "Rejected")}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[10px] transition shadow"
                      >
                        ✕ Tolak
                      </button>
                    </div>
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
