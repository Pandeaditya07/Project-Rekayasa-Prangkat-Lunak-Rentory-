"use client";

import React, { useState, useEffect } from "react";

const NAMA_BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const NAMA_HARI = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const toDateKey = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const mapDbStatusToBadge = (dbStatus) => {
  if (!dbStatus || dbStatus === "Pending" || dbStatus === "Menunggu")
    return "Pending";
  if (dbStatus === "Approved" || dbStatus === "Disetujui" || dbStatus === "ACC")
    return "ACC";
  if (dbStatus === "Rejected" || dbStatus === "Ditolak") return "Rejected";
  return dbStatus;
};

const detectKategori = (namaKegiatan = "") => {
  if (namaKegiatan.toUpperCase().startsWith("[INVENTARIS]")) {
    return "Inventaris";
  }
  return "Gedung";
};

export default function AdminDashboardPage() {
  const [activities, setActivities] = useState([]);
  const [dbTotals, setDbTotals] = useState({
    totalGedung: 0,
    totalInventaris: 0,
  });
  const [loading, setLoading] = useState(true);

  // State Kalender Interaktif
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState(() =>
    toDateKey(new Date()),
  );

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const res = await fetch("/api/peminjaman");
        const json = await res.json();

        if (isMounted && json.success) {
          if (json.stats) {
            setDbTotals({
              totalGedung: Number(json.stats.totalGedung || 0),
              totalInventaris: Number(json.stats.totalInventaris || 0),
            });
          }

          if (Array.isArray(json.data)) {
            const mappedActivities = json.data.map((row) => {
              const tglPengajuan = row.created_at
                ? new Date(row.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : row.tgl_mulai
                  ? new Date(row.tgl_mulai).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-";

              const tglAcara = row.tgl_mulai
                ? new Date(row.tgl_mulai).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-";

              const dateKeyAcara = row.tgl_mulai
                ? toDateKey(new Date(row.tgl_mulai))
                : null;

              return {
                id: row.id_peminjaman_ruang,
                tanggal: tglPengajuan,
                dateKeyAcara,
                user: row.username || row.peminjam || `User #${row.id_user}`,
                aktivitas:
                  row.nama_kegiatan ||
                  row.nama_ruangan ||
                  row.nama_gedung ||
                  "Pengajuan Peminjaman",
                subtext: `${row.organisasi || row.peminjam || "Mahasiswa"} | ${tglAcara}`,
                status: mapDbStatusToBadge(row.status),
                kategori: detectKategori(row.nama_kegiatan),
              };
            });

            setActivities(mappedActivities);
          }
        }
      } catch (error) {
        console.error("Gagal memuat data dashboard admin:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleStatusChange = async (id, newBadgeStatus) => {
    const dbStatusValue = newBadgeStatus === "ACC" ? "Approved" : "Rejected";

    try {
      const res = await fetch("/api/peminjaman", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_peminjaman_ruang: id,
          status: dbStatusValue,
        }),
      });
      const result = await res.json();

      if (result.success) {
        setActivities((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: newBadgeStatus } : item,
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

  const totalGedungDipinjam = activities.filter(
    (a) => a.kategori === "Gedung" && a.status === "ACC",
  ).length;

  const totalInventarisDipinjam = activities.filter(
    (a) => a.kategori === "Inventaris" && a.status === "ACC",
  ).length;

  const ketersediaanGedung = Math.max(
    0,
    dbTotals.totalGedung - totalGedungDipinjam,
  );
  const ketersediaanInventaris = Math.max(
    0,
    dbTotals.totalInventaris - totalInventarisDipinjam,
  );

  const stats = [
    { title: "Ketersediaan Gedung", value: `${ketersediaanGedung} Gedung` },
    { title: "Gedung Yang Dipinjam", value: `${totalGedungDipinjam} Gedung` },
    {
      title: "Ketersediaan Inventaris",
      value: `${ketersediaanInventaris} Unit`,
    },
    {
      title: "Inventaris Yang Dipinjam",
      value: `${totalInventarisDipinjam} Unit`,
    },
  ];

  // Kalkulasi Grid Kalender Bulanan
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfMonth + 6) % 7; // Senin sebagai kolom pertama
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarCells = [];
  for (let i = startOffset - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      inMonth: false,
      dateKey: toDateKey(new Date(year, month - 1, daysInPrevMonth - i)),
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      day: d,
      inMonth: true,
      dateKey: toDateKey(new Date(year, month, d)),
    });
  }
  while (calendarCells.length < 35) {
    const nextDay = calendarCells.length - (startOffset + daysInMonth) + 1;
    calendarCells.push({
      day: nextDay,
      inMonth: false,
      dateKey: toDateKey(new Date(year, month + 1, nextDay)),
    });
  }

  const todayKey = toDateKey(new Date());
  const eventDateSet = new Set(
    activities
      .filter((a) => a.status !== "Rejected" && a.dateKeyAcara)
      .map((a) => a.dateKeyAcara),
  );
  const selectedDayEvents = activities.filter(
    (a) => a.status !== "Rejected" && a.dateKeyAcara === selectedDateKey,
  );

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

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

        {/* Mini Calendar Widget Interaktif */}
        <div className="bg-[#11232d] border border-[#1d3847] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-300">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="hover:text-cyan-400 px-2 py-0.5 rounded transition"
                title="Bulan Sebelumnya"
              >
                {"<"}
              </button>
              <span className="tracking-wide">
                {NAMA_BULAN[month]} {year}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="hover:text-cyan-400 px-2 py-0.5 rounded transition"
                title="Bulan Berikutnya"
              >
                {">"}
              </button>
            </div>

            <div className="grid grid-cols-7 text-center text-[10px] text-slate-400 gap-y-1.5 font-mono">
              {NAMA_HARI.map((hari) => (
                <span key={hari} className="font-semibold text-slate-500">
                  {hari}
                </span>
              ))}

              {calendarCells.map((cell, idx) => {
                const isToday = cell.dateKey === todayKey;
                const isSelected = cell.dateKey === selectedDateKey;
                const hasEvent = eventDateSet.has(cell.dateKey);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedDateKey(cell.dateKey)}
                    className={`relative w-6 h-6 mx-auto flex items-center justify-center rounded-full transition ${
                      isToday
                        ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/50"
                        : isSelected
                          ? "bg-[#1e4252] text-cyan-300 font-bold ring-1 ring-cyan-400"
                          : cell.inMonth
                            ? "text-slate-200 hover:bg-[#1a3442]"
                            : "text-slate-600"
                    }`}
                  >
                    {cell.day}
                    {hasEvent && !isToday && (
                      <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info Jadwal Singkat pada Tanggal yang Dipilih */}
          <div className="mt-3 pt-2 border-t border-[#1d3847] text-[10px]">
            {selectedDayEvents.length > 0 ? (
              <p className="text-cyan-300 truncate">
                • {selectedDayEvents[0].aktivitas}
                {selectedDayEvents.length > 1
                  ? ` (+${selectedDayEvents.length - 1} lainnya)`
                  : ""}
              </p>
            ) : (
              <p className="text-slate-500">Tidak ada jadwal peminjaman</p>
            )}
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400">
                    Memuat data aktivitas peminjaman...
                  </td>
                </tr>
              ) : activities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400">
                    Belum ada pengajuan peminjaman masuk.
                  </td>
                </tr>
              ) : (
                activities.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#18303e]/40 transition"
                  >
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
                      <p className="font-semibold text-white">
                        {item.aktivitas}
                      </p>
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
                          type="button"
                          onClick={() => handleStatusChange(item.id, "ACC")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[10px] transition shadow"
                        >
                          ✓ ACC
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleStatusChange(item.id, "Rejected")
                          }
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-[10px] transition shadow"
                        >
                          ✕ Tolak
                        </button>
                      </div>
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
