"use client";

import { useState, useEffect } from "react";

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

export default function UserRootDashboardPage() {
  const [allActivities, setAllActivities] = useState([]);
  const [myActivities, setMyActivities] = useState([]);
  const [dbTotals, setDbTotals] = useState({
    totalGedung: 0,
    totalInventaris: 0,
  });
  const [loading, setLoading] = useState(true);

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

              return {
                id: row.id_peminjaman_ruang,
                id_user: Number(row.id_user),
                tanggal: tglPengajuan,
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

            // Saring hanya data milik akun yang sedang login
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white tracking-tight">
        Dashboard Utama
      </h2>

      {/* Section 1: 4 Cards + Kalender Mini */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
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

        {/* Widget Kalender Mini Kanan */}
        <div className="xl:col-span-3 bg-[#0d2229] border border-[#15343d] rounded-2xl p-4 text-xs shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between font-semibold text-slate-300 mb-3">
            <button type="button" className="text-slate-400 hover:text-white">
              {"<"}
            </button>
            <span className="font-bold">April 2026</span>
            <button type="button" className="text-slate-400 hover:text-white">
              {">"}
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-slate-500 mb-2 text-[10px]">
            <span>Lu</span>
            <span>Ma</span>
            <span>Du</span>
            <span>Dr</span>
            <span>Vo</span>
            <span>Se</span>
            <span>Mo</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-slate-300 text-[11px]">
            <span className="text-slate-600">28</span>
            <span className="text-slate-600">29</span>
            <span className="text-slate-600">30</span>
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
            <span>7</span>
            <span>8</span>
            <span className="rounded-full bg-cyan-600 font-bold text-white flex items-center justify-center w-5 h-5 mx-auto">
              9
            </span>
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
