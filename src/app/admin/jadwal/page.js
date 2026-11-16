"use client";

import { useState, useEffect, useCallback } from "react";

function transformJadwalData(jsonGedung, jsonPeminjaman) {
  const todayStr = new Date().toISOString().split("T")[0];
  const allLoans =
    jsonPeminjaman?.success && Array.isArray(jsonPeminjaman.data)
      ? jsonPeminjaman.data
      : [];

  const gedungLoans = allLoans.filter(
    (row) =>
      !(row.nama_kegiatan || "").toUpperCase().startsWith("[INVENTARIS]"),
  );

  const enrichedGedung =
    jsonGedung?.success && Array.isArray(jsonGedung.data)
      ? jsonGedung.data.map((item) => {
          const isUsedToday = gedungLoans.some((loan) => {
            const isApproved =
              loan.status === "Approved" ||
              loan.status === "Disetujui" ||
              loan.status === "ACC";
            if (!isApproved || !loan.tgl_mulai) return false;

            const loanDate = new Date(loan.tgl_mulai)
              .toISOString()
              .split("T")[0];
            const namaLokasi = (
              loan.nama_ruangan ||
              loan.nama_gedung ||
              ""
            ).toLowerCase();

            return (
              loanDate === todayStr && namaLokasi === item.nama.toLowerCase()
            );
          });

          return {
            ...item,
            sedangDipakai: isUsedToday,
          };
        })
      : [];

  const mappedAgenda = gedungLoans.map((row) => {
    const startObj = row.tgl_mulai ? new Date(row.tgl_mulai) : null;
    const endObj = row.tgl_selesai ? new Date(row.tgl_selesai) : null;

    const tanggalStr = startObj
      ? startObj.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "-";

    const jamMulai = startObj
      ? startObj.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--.--";

    const jamSelesai = endObj
      ? endObj.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--.--";

    let statusLabel = "Menunggu";
    if (
      row.status === "Approved" ||
      row.status === "Disetujui" ||
      row.status === "ACC"
    ) {
      statusLabel = "Disetujui";
    } else if (row.status === "Rejected" || row.status === "Ditolak") {
      statusLabel = "Ditolak";
    }

    return {
      id: row.id_peminjaman_ruang,
      tanggal: tanggalStr,
      waktu: `${jamMulai}-${jamSelesai}`,
      gedung: row.nama_ruangan || row.nama_gedung || "-",
      kegiatan: row.nama_kegiatan || "-",
      peminjam: row.organisasi || row.peminjam || `User #${row.id_user}`,
      status: statusLabel,
    };
  });

  return { enrichedGedung, mappedAgenda };
}

export default function JadwalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [gedungRuangList, setGedungRuangList] = useState([]);
  const [agendaList, setAgendaList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModalTambah, setShowModalTambah] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newFacility, setNewFacility] = useState({
    jenis: "Gedung",
    nama: "",
    kapasitas: "",
    fasilitas: "",
  });

  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editFacility, setEditFacility] = useState({
    id: null,
    jenis: "Gedung",
    nama: "",
    kapasitas: "",
    fasilitas: "",
  });

  const refreshData = useCallback(async () => {
    try {
      const [resGedung, resPeminjaman] = await Promise.all([
        fetch("/api/gedung", { cache: "no-store" }),
        fetch("/api/peminjaman", { cache: "no-store" }),
      ]);
      const jsonGedung = await resGedung.json();
      const jsonPeminjaman = await resPeminjaman.json();

      const { enrichedGedung, mappedAgenda } = transformJadwalData(
        jsonGedung,
        jsonPeminjaman,
      );
      setGedungRuangList(enrichedGedung);
      setAgendaList(mappedAgenda);
    } catch (error) {
      console.error("Gagal memuat data gedung & jadwal:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initFetch = async () => {
      try {
        const [resGedung, resPeminjaman] = await Promise.all([
          fetch("/api/gedung", { cache: "no-store" }),
          fetch("/api/peminjaman", { cache: "no-store" }),
        ]);
        const jsonGedung = await resGedung.json();
        const jsonPeminjaman = await resPeminjaman.json();

        if (!isMounted) return;

        const { enrichedGedung, mappedAgenda } = transformJadwalData(
          jsonGedung,
          jsonPeminjaman,
        );
        setGedungRuangList(enrichedGedung);
        setAgendaList(mappedAgenda);
      } catch (error) {
        console.error("Gagal memuat data gedung & jadwal:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddFacility = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/gedung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jenis: newFacility.jenis,
          nama: newFacility.nama,
          kapasitas: Number(newFacility.kapasitas) || 0,
          fasilitas: newFacility.fasilitas,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowModalTambah(false);
        setNewFacility({
          jenis: "Gedung",
          nama: "",
          kapasitas: "",
          fasilitas: "",
        });
        await refreshData();
      } else {
        alert(`Gagal menambahkan: ${json.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi saat menyimpan data.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setEditFacility({
      id: item.id,
      jenis: item.jenis,
      nama: item.nama,
      kapasitas: item.kapasitas,
      fasilitas: item.fasilitas === "-" ? "" : item.fasilitas,
    });
    setShowModalEdit(true);
  };

  const handleUpdateFacility = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/gedung", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editFacility.id,
          jenis: editFacility.jenis,
          nama: editFacility.nama,
          kapasitas: Number(editFacility.kapasitas) || 0,
          fasilitas: editFacility.fasilitas,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowModalEdit(false);
        await refreshData();
      } else {
        alert(`Gagal memperbarui: ${json.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi saat memperbarui data.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFacility = async (item) => {
    if (!confirm(`Yakin ingin menghapus ${item.jenis} ${item.nama}?`)) return;
    try {
      const res = await fetch(
        `/api/gedung?id=${item.id}&jenis=${encodeURIComponent(item.jenis)}`,
        { method: "DELETE" },
      );
      const json = await res.json();
      if (json.success) {
        await refreshData();
      } else {
        alert(json.message || "Gagal menghapus data.");
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi saat menghapus data.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">
          Jadwal & Kelola Gedung
        </h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Cari gedung, ruang, atau kegiatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-[#13232c] border border-[#213c4c] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="button"
            onClick={() => setShowModalTambah(true)}
            className="px-4 py-2 bg-[#257585] hover:bg-[#1f626f] text-white font-bold rounded-xl text-xs transition shadow-lg shrink-0"
          >
            + Tambah Gedung / Ruang
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340] text-center text-xs text-slate-400">
          Memuat daftar gedung dan ruangan...
        </div>
      ) : gedungRuangList.length === 0 ? (
        <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340] text-center text-xs text-slate-400">
          Belum ada gedung atau ruangan terdaftar. Klik tombol + Tambah Gedung /
          Ruang di atas untuk menambahkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {gedungRuangList
            .filter(
              (item) =>
                item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.fasilitas
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()),
            )
            .map((item) => (
              <div
                key={item.uid}
                className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md flex flex-col justify-between gap-4"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 text-[10px] font-bold uppercase mb-1.5">
                      {item.jenis}
                    </span>
                    <h3 className="text-base font-bold text-white">
                      {item.nama}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Kapasitas {item.kapasitas} orang
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Fasilitas: {item.fasilitas}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                      item.sedangDipakai
                        ? "bg-amber-950 text-amber-300 border border-amber-800/50"
                        : "bg-emerald-950 text-emerald-300 border border-emerald-800/50"
                    }`}
                  >
                    {item.sedangDipakai ? "Terpakai hari ini" : "Tersedia"}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1b3340]">
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    className="px-3 py-1 bg-cyan-800 hover:bg-cyan-700 text-white font-bold rounded-lg text-[10px]"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteFacility(item)}
                    className="px-3 py-1 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px]"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className="bg-[#13232c] p-6 rounded-2xl border border-[#1b3340] shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4">Agenda Minggu Ini</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#213c4c] text-slate-400 uppercase">
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Waktu</th>
                <th className="py-3 px-3">Gedung / Ruang</th>
                <th className="py-3 px-3">Kegiatan</th>
                <th className="py-3 px-3">Peminjam</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b3340]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    Memuat jadwal operasional...
                  </td>
                </tr>
              ) : agendaList.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    Belum ada jadwal peminjaman gedung atau ruangan minggu ini.
                  </td>
                </tr>
              ) : (
                agendaList
                  .filter(
                    (j) =>
                      j.kegiatan
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      j.peminjam
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      j.gedung
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
                              : item.status === "Ditolak"
                                ? "bg-rose-950 text-rose-300 border border-rose-800/50"
                                : "bg-amber-950 text-amber-300 border border-amber-800/50"
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

      {showModalTambah && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13232c] border border-[#213c4c] p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">
              Tambah Gedung / Ruang Baru
            </h3>
            <form onSubmit={handleAddFacility} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Jenis</label>
                <select
                  value={newFacility.jenis}
                  onChange={(e) =>
                    setNewFacility({ ...newFacility, jenis: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                >
                  <option value="Gedung">Gedung</option>
                  <option value="Ruang">Ruang</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">
                  Nama Gedung / Ruang
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Aula FMIPA"
                  value={newFacility.nama}
                  onChange={(e) =>
                    setNewFacility({ ...newFacility, nama: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">
                  Kapasitas (Orang)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="Contoh: 300"
                  value={newFacility.kapasitas}
                  onChange={(e) =>
                    setNewFacility({
                      ...newFacility,
                      kapasitas: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Fasilitas</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Proyektor, AC, Sound System, Kursi 300"
                  value={newFacility.fasilitas}
                  onChange={(e) =>
                    setNewFacility({
                      ...newFacility,
                      fasilitas: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModalTambah(false)}
                  className="flex-1 py-2 bg-slate-700 text-slate-200 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-[#257585] text-white font-bold rounded-xl disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModalEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13232c] border border-[#213c4c] p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">
              Edit {editFacility.jenis}
            </h3>
            <form onSubmit={handleUpdateFacility} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">
                  Nama {editFacility.jenis}
                </label>
                <input
                  type="text"
                  required
                  value={editFacility.nama}
                  onChange={(e) =>
                    setEditFacility({ ...editFacility, nama: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">
                  Kapasitas (Orang)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={editFacility.kapasitas}
                  onChange={(e) =>
                    setEditFacility({
                      ...editFacility,
                      kapasitas: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Fasilitas</label>
                <input
                  type="text"
                  required
                  value={editFacility.fasilitas}
                  onChange={(e) =>
                    setEditFacility({
                      ...editFacility,
                      fasilitas: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModalEdit(false)}
                  className="flex-1 py-2 bg-slate-700 text-slate-200 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-[#257585] text-white font-bold rounded-xl disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
