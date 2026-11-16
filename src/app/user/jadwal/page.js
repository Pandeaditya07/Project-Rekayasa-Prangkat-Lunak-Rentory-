"use client";

import { useState, useEffect } from "react";

function mapApprovedSchedules(rows) {
  if (!Array.isArray(rows)) return [];

  return rows
    .filter((row) => {
      const statusNorm = (row.status || "").toLowerCase();
      const isApproved =
        statusNorm === "approved" ||
        statusNorm === "disetujui" ||
        statusNorm === "acc";

      const isInventaris = (row.nama_kegiatan || "")
        .toUpperCase()
        .startsWith("[INVENTARIS]");

      return isApproved && !isInventaris;
    })
    .map((row) => {
      const startObj = row.tgl_mulai ? new Date(row.tgl_mulai) : null;
      const endObj = row.tgl_selesai ? new Date(row.tgl_selesai) : null;

      const hariTanggal = startObj
        ? startObj.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "-";

      const jamMulai = startObj
        ? startObj
            .toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(":", ".")
        : "--.--";

      const jamSelesai = endObj
        ? endObj
            .toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(":", ".")
        : "--.--";

      let durasiMenit = "-";
      if (startObj && endObj && !isNaN(startObj) && !isNaN(endObj)) {
        const diffMins = Math.max(
          0,
          Math.round((endObj.getTime() - startObj.getTime()) / 60000),
        );
        durasiMenit = `${diffMins} Menit`;
      }

      return {
        id: row.id_peminjaman_ruang,
        gedung: row.nama_ruangan || row.nama_gedung || "Gedung / Ruang",
        kegiatan: row.nama_kegiatan || "Kegiatan Terjadwal",
        peminjam: row.organisasi || row.peminjam || `User #${row.id_user}`,
        hariTanggal,
        waktu: `${jamMulai} - ${jamSelesai} WITA`,
        durasi: durasiMenit,
      };
    });
}

export default function UserJadwalPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadApprovedSchedules = async () => {
      try {
        const res = await fetch("/api/peminjaman", { cache: "no-store" });
        const json = await res.json();

        if (isMounted && json.success) {
          setSchedules(mapApprovedSchedules(json.data));
        }
      } catch (error) {
        console.error("Gagal memuat jadwal gedung disetujui:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadApprovedSchedules();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Jadwal Gedung
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Daftar penggunaan gedung dan ruangan yang telah disetujui oleh
            Admin.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#18535e]/40 border border-[#23707e]/40 rounded-2xl p-8 text-center text-xs text-slate-300">
          Memuat jadwal gedung yang telah disetujui...
        </div>
      ) : schedules.length === 0 ? (
        <div className="bg-[#18535e]/40 border border-[#23707e]/40 rounded-2xl p-8 text-center text-xs text-slate-300">
          Belum ada jadwal peminjaman gedung atau ruangan yang disetujui Admin.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schedules.map((item) => (
            <div
              key={item.id}
              className="bg-[#18535e]/75 border border-[#23707e]/50 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-5"
            >
              {/* Header Kartu: Nama Gedung & Nama Kegiatan */}
              <div className="text-center border-b border-[#257482]/50 pb-4">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {item.gedung}
                </h3>
                <p className="text-xs text-cyan-100/85 mt-1 font-medium">
                  {item.kegiatan}
                </p>
              </div>

              {/* Detail Jadwal */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-100/75">Peminjam</span>
                  <span className="font-bold text-white text-right">
                    {item.peminjam}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-100/75">Hari/Tanggal</span>
                  <span className="font-bold text-white text-right">
                    {item.hariTanggal}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-100/75">Waktu</span>
                  <span className="font-bold text-white text-right">
                    {item.waktu}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cyan-100/75">Durasi</span>
                  <span className="font-bold text-white text-right">
                    {item.durasi}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
