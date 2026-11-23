"use client";

import { useState, useEffect, useCallback } from "react";

export default function InventarisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventarisList, setInventarisList] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Modal Tambah
  const [showModalTambah, setShowModalTambah] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newInventaris, setNewInventaris] = useState({
    nama: "",
    kategori: "Elektronik",
    jumlah: "",
    kondisi: "Baik",
  });

  // State Modal Edit
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editInventaris, setEditInventaris] = useState({
    id_inventaris: null,
    kode: "",
    nama: "",
    kategori: "Elektronik",
    jumlah: "",
    kondisi: "Baik",
  });

  const fetchInventaris = useCallback(async () => {
    try {
      const res = await fetch("/api/inventaris", { cache: "no-store" });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped = json.data.map((row) => {
          const qty = Number(row.jumlah ?? row.stok ?? 0);
          return {
            id_inventaris: row.id_inventaris,
            kode: `INV-${String(row.id_inventaris).padStart(3, "0")}`,
            nama: row.nama_inventaris || row.nama_barang || row.nama || "-",
            kategori: row.kategori || "Elektronik",
            jumlah: qty,
            tersedia: Number(row.tersedia ?? qty),
            kondisi: row.kondisi || "Baik",
          };
        });
        setInventarisList(mapped);
      }
    } catch (error) {
      console.error("Gagal memuat data inventaris:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitial = async () => {
      try {
        const res = await fetch("/api/inventaris", { cache: "no-store" });
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((row) => {
            const qty = Number(row.jumlah ?? row.stok ?? 0);
            return {
              id_inventaris: row.id_inventaris,
              kode: `INV-${String(row.id_inventaris).padStart(3, "0")}`,
              nama: row.nama_inventaris || row.nama_barang || row.nama || "-",
              kategori: row.kategori || "Elektronik",
              jumlah: qty,
              tersedia: Number(row.tersedia ?? qty),
              kondisi: row.kondisi || "Baik",
            };
          });
          setInventarisList(mapped);
        }
      } catch (error) {
        console.error("Gagal memuat data inventaris:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitial();

    return () => {
      isMounted = false;
    };
  }, []);

  // Tambah Inventaris ke Database
  const handleAddInventaris = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/inventaris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama_inventaris: newInventaris.nama,
          kategori: newInventaris.kategori,
          jumlah: Number(newInventaris.jumlah) || 0,
          kondisi: newInventaris.kondisi,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowModalTambah(false);
        setNewInventaris({
          nama: "",
          kategori: "Elektronik",
          jumlah: "",
          kondisi: "Baik",
        });
        await fetchInventaris();
      } else {
        alert(`Gagal menambahkan inventaris: ${json.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi saat menyimpan inventaris.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Buka Modal Edit
  const openEditModal = (item) => {
    setEditInventaris({
      id_inventaris: item.id_inventaris,
      kode: item.kode,
      nama: item.nama,
      kategori: item.kategori,
      jumlah: item.jumlah,
      kondisi: item.kondisi,
    });
    setShowModalEdit(true);
  };

  // Simpan Perubahan Edit ke Database
  const handleUpdateInventaris = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/inventaris", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_inventaris: editInventaris.id_inventaris,
          nama_inventaris: editInventaris.nama,
          kategori: editInventaris.kategori,
          jumlah: Number(editInventaris.jumlah) || 0,
          kondisi: editInventaris.kondisi,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowModalEdit(false);
        await fetchInventaris();
      } else {
        alert(`Gagal memperbarui inventaris: ${json.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi saat memperbarui inventaris.");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Hapus Inventaris dari Database
  const handleDeleteInventaris = async (item) => {
    if (!confirm(`Yakin ingin menghapus ${item.nama} (${item.kode})?`)) return;
    try {
      const res = await fetch(`/api/inventaris?id=${item.id_inventaris}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        await fetchInventaris();
      } else {
        alert(`Gagal menghapus inventaris: ${json.message}`);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi saat menghapus inventaris.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">Kelola Inventaris</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Cari nama atau kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 bg-[#13232c] border border-[#213c4c] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
          />
          <button
            type="button"
            onClick={() => setShowModalTambah(true)}
            className="px-4 py-2 bg-[#257585] hover:bg-[#1f626f] text-white font-bold rounded-xl text-xs transition shadow-lg shrink-0"
          >
            + Tambah Inventaris
          </button>
        </div>
      </div>

      {/* Stat Cards */}
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
          <p className="text-[11px] text-cyan-300 mt-0.5">seluruh kategori</p>
        </div>
        <div className="bg-[#13232c] p-5 rounded-2xl border border-[#1b3340] shadow-md">
          <p className="text-xs text-amber-200 font-semibold uppercase">
            Perlu Perbaikan
          </p>
          <p className="text-3xl font-bold text-amber-300 mt-1">
            {
              inventarisList.filter((i) => i.kondisi === "Perlu perbaikan")
                .length
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
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400">
                    Memuat data inventaris...
                  </td>
                </tr>
              ) : inventarisList.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400">
                    Belum ada data inventaris. Klik + Tambah Inventaris untuk
                    menambahkan barang baru.
                  </td>
                </tr>
              ) : (
                inventarisList
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
                    <tr key={item.id_inventaris} className="hover:bg-[#192f3b]">
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
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="px-3 py-1 bg-cyan-800 hover:bg-cyan-700 text-white font-bold rounded-lg text-[10px]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteInventaris(item)}
                          className="px-3 py-1 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px]"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Inventaris */}
      {showModalTambah && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13232c] border border-[#213c4c] p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">
              Tambah Inventaris Baru
            </h3>
            <form onSubmit={handleAddInventaris} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Nama Barang</label>
                <input
                  type="text"
                  required
                  value={newInventaris.nama}
                  onChange={(e) =>
                    setNewInventaris({ ...newInventaris, nama: e.target.value })
                  }
                  className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Kategori</label>
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
                    min="0"
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
                  {submitting ? "Menyimpan..." : "Simpan Inventaris"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Inventaris */}
      {showModalEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#13232c] border border-[#213c4c] p-6 rounded-2xl w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-white">
              Edit Inventaris ({editInventaris.kode})
            </h3>
            <form
              onSubmit={handleUpdateInventaris}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-300 mb-1">Nama Barang</label>
                <input
                  type="text"
                  required
                  value={editInventaris.nama}
                  onChange={(e) =>
                    setEditInventaris({
                      ...editInventaris,
                      nama: e.target.value,
                    })
                  }
                  className="w-full p-2.5 bg-[#0b151a] border border-[#213745] rounded-xl text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Kategori</label>
                  <select
                    value={editInventaris.kategori}
                    onChange={(e) =>
                      setEditInventaris({
                        ...editInventaris,
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
                    min="0"
                    value={editInventaris.jumlah}
                    onChange={(e) =>
                      setEditInventaris({
                        ...editInventaris,
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
                  value={editInventaris.kondisi}
                  onChange={(e) =>
                    setEditInventaris({
                      ...editInventaris,
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
