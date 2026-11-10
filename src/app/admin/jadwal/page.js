"use client";

import { useState } from "react";

export default function JadwalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModalJadwal, setShowModalJadwal] = useState(false);
  const [newJadwal, setNewJadwal] = useState({
    tanggal: "",
    waktu: "",
    gedung: "Gedung AS Biologi",
    kegiatan: "",
    peminjam: "",
  });

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

  return (
    <div className="space-y-6">
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

      {/* Status Gedung */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-white">
              Gedung AS Biologi
            </h3>
            <p className="text-xs text-slate-400 mt-1">Kapasitas 150 orang</p>
          </div>
          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/50 rounded-lg text-xs font-bold">
            Tersedia
          </span>
        </div>
        <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-white">Ruang Seminar</h3>
            <p className="text-xs text-slate-400 mt-1">Kapasitas 80 orang</p>
          </div>
          <span className="px-3 py-1 bg-amber-950 text-amber-300 border border-amber-800/50 rounded-lg text-xs font-bold">
            Terpakai hari ini
          </span>
        </div>
        <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-white">Aula Utama</h3>
            <p className="text-xs text-slate-400 mt-1">Kapasitas 300 orang</p>
          </div>
          <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/50 rounded-lg text-xs font-bold">
            Tersedia
          </span>
        </div>
      </div>

      {/* Tabel Agenda */}
      <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340] shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Agenda Minggu Ini</h3>
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

      {/* Modal Tambah Jadwal */}
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
    </div>
  );
}
