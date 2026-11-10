"use client";

import { useState } from "react";

export default function InventarisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showModalInventaris, setShowModalInventaris] = useState(false);
  const [newInventaris, setNewInventaris] = useState({
    nama: "",
    kategori: "Elektronik",
    jumlah: "",
    kondisi: "Baik",
  });

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

  const handleAddInventaris = (e) => {
    e.preventDefault();
    const count = inventarisList.length + 1;
    const kodeStr = `INV-00${count}`;
    const qty = parseInt(newInventaris.jumlah) || 0;
    setInventarisList([
      ...inventarisList,
      { ...newInventaris, kode: kodeStr, tersedia: qty, jumlah: qty },
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
            onClick={() => setShowModalInventaris(true)}
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
              {inventarisList
                .filter(
                  (item) =>
                    item.nama
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    item.kode.toLowerCase().includes(searchQuery.toLowerCase()),
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
                        onClick={() => handleDeleteInventaris(item.kode)}
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

      {/* Modal Tambah Inventaris */}
      {showModalInventaris && (
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
  );
}
