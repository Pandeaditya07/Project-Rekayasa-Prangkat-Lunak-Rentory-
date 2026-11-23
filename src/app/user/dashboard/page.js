"use client";

import { useState, useEffect } from "react";

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

export default function UserDashboardPage() {
  const [allActivities, setAllActivities] = useState([]);
  const [myActivities, setMyActivities] = useState([]);
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

    const loadUserDashboard = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const currentUserId = Number(
          savedUser.id_user || savedUser.id || savedUser.user_id || 0,
        );

        const res = await fetch("/api/peminjaman", { cache: "no-store" });
        const json = await res.json();

        if (isMounted && json.success) {
          if (json.stats) {
            setDbTotals({
              totalGedung: Number(json.stats.totalGedung || 0),
              totalInventaris: Number(json.stats.totalInventaris || 0),
            });
          }

          if (Array.isArray(json.data)) {
            const mappedAll = json.data.map((row) => {
              const tglPengajuan = row.tgl_mulai
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
                id_user: Number(row.id_user),
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

            setAllActivities(mappedAll);

            const filteredMine = currentUserId
              ? mappedAll.filter((item) => item.id_user === currentUserId)
              : [];
            setMyActivities(filteredMine);
          }
        }
      } catch (error) {
        console.error("Gagal memuat dashboard user:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadUserDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalSemuaGedungDipinjam = allActivities.filter(
    (a) => a.kategori === "Gedung" && a.status === "ACC",
  ).length;

  const totalSemuaInventarisDipinjam = allActivities.filter(
    (a) => a.kategori === "Inventaris" && a.status === "ACC",
  ).length;

  const gedungDipinjamSaya = myActivities.filter(
    (a) => a.kategori === "Gedung" && a.status === "ACC",
  ).length;

  const inventarisDipinjamSaya = myActivities.filter(
    (a) => a.kategori === "Inventaris" && a.status === "ACC",
  ).length;

  const ketersediaanGedung = Math.max(
    0,
    dbTotals.totalGedung - totalSemuaGedungDipinjam,
  );
  const ketersediaanInventaris = Math.max(
    0,
    dbTotals.totalInventaris - totalSemuaInventarisDipinjam,
  );

  // Kalkulasi Grid Kalender Bulanan
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startOffset = (firstDayOfMonth + 6) % 7;
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
    allActivities
      .filter((a) => a.status !== "Rejected" && a.dateKeyAcara)
      .map((a) => a.dateKeyAcara),
  );
  const selectedDayEvents = allActivities.filter(
    (a) => a.status !== "Rejected" && a.dateKeyAcara === selectedDateKey,
  );

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white tracking-tight">
        Dashboard Utama
      </h2>

      {/* Section 1: 4 Cards + Kalender Mini */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
        {/* 4 Cards */}
        <div className="xl:col-span-9 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#18535e]/80 border border-[#23707e]/50 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-lg min-h-[140px]">
            <p className="text-[11px] font-medium text-cyan-100/80 mb-2">
              Ketersediaan
              <br />
              Gedung
            </p>
            <p className="text-2xl font-black text-white">
              {ketersediaanGedung} Gedung
            </p>
          </div>

          <div className="bg-[#18535e]/80 border border-[#23707e]/50 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-lg min-h-[140px]">
            <p className="text-[11px] font-medium text-cyan-100/80 mb-2">
              Gedung Yang
              <br />
              Dipinjam
            </p>
            <p className="text-2xl font-black text-white">
              {gedungDipinjamSaya} Gedung
            </p>
          </div>

          <div className="bg-[#18535e]/80 border border-[#23707e]/50 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-lg min-h-[140px]">
            <p className="text-[11px] font-medium text-cyan-100/80 mb-2">
              Ketersediaan Inventaris
            </p>
            <p className="text-2xl font-black text-white">
              {ketersediaanInventaris} Unit
            </p>
          </div>

          <div className="bg-[#18535e]/80 border border-[#23707e]/50 rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-lg min-h-[140px]">
            <p className="text-[11px] font-medium text-cyan-100/80 mb-2">
              Inventaris Yang
              <br />
              Dipinjam
            </p>
            <p className="text-2xl font-black text-white">
              {inventarisDipinjamSaya} Unit
            </p>
          </div>
        </div>

        {/* Widget Kalender Mini Interaktif */}
        <div className="xl:col-span-3 bg-[#0d2229] border border-[#15343d] rounded-2xl p-4 text-xs shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between font-semibold text-slate-300 mb-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded transition"
                title="Bulan Sebelumnya"
              >
                {"<"}
              </button>
              <span className="font-bold">
                {NAMA_BULAN[month]} {year}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded transition"
                title="Bulan Berikutnya"
              >
                {">"}
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-500 mb-2 text-[10px]">
              {NAMA_HARI.map((hari) => (
                <span key={hari}>{hari}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-slate-300 text-[11px]">
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
                        ? "bg-cyan-600 font-bold text-white shadow-md shadow-cyan-500/40"
                        : isSelected
                          ? "bg-[#184452] text-cyan-300 font-bold ring-1 ring-cyan-400"
                          : cell.inMonth
                            ? "text-slate-300 hover:bg-[#15343d]"
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
          <div className="mt-3 pt-2 border-t border-[#15343d] text-[10px]">
            {selectedDayEvents.length > 0 ? (
              <p className="text-cyan-300 truncate">
                • {selectedDayEvents[0].aktivitas}
                {selectedDayEvents.length > 1
                  ? ` (+${selectedDayEvents.length - 1} lainnya)`
                  : ""}
              </p>
            ) : (
              <p className="text-slate-500">Tidak ada jadwal terpakai</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Tabel Aktivitas Terakhir Milik Akun Ini */}
      <div className="bg-[#0d2229] border border-[#15343d] rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">
          Aktivitas Terakhir
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#183d47] text-slate-400">
                <th className="py-3 px-2 font-semibold">Tanggal</th>
                <th className="py-3 px-2 font-semibold">user</th>
                <th className="py-3 px-2 font-semibold">Aktivitas</th>
                <th className="py-3 px-2 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#132e36]">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-400">
                    Memuat data aktivitas peminjaman...
                  </td>
                </tr>
              ) : myActivities.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-slate-400">
                    Belum ada pengajuan peminjaman pada akun ini.
                  </td>
                </tr>
              ) : (
                myActivities.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 px-2 text-slate-300 whitespace-nowrap">
                      {item.tanggal}
                    </td>
                    <td className="py-4 px-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border border-slate-500 flex items-center justify-center text-[10px] text-slate-300">
                          👤
                        </div>
                        <span className="text-slate-200">{item.user}</span>
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <p className="font-bold text-white">{item.aktivitas}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {item.subtext}
                      </p>
                    </td>
                    <td className="py-4 px-2 text-center whitespace-nowrap">
                      <span
                        className={`inline-block text-white font-bold text-[10px] px-5 py-1.5 rounded-full shadow ${
                          item.status === "ACC"
                            ? "bg-[#1eb854]"
                            : item.status === "Rejected"
                              ? "bg-[#bd2424]"
                              : "bg-[#d99b26]"
                        }`}
                      >
                        {item.status}
                      </span>
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
