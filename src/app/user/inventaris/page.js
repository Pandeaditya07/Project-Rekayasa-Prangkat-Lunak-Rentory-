"use client";
import { useState, useEffect } from "react";

export default function UserInventarisPage() {
  const [inventaris, setInventaris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inventaris")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setInventaris(data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">
        Daftar Inventaris Tersedia
      </h2>

      {loading ? (
        <p className="text-slate-400 text-xs">Memuat data inventaris...</p>
      ) : inventaris.length === 0 ? (
        <p className="text-slate-400 text-xs">
          Belum ada inventaris yang tersedia.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {inventaris.map((item) => (
            <div
              key={item.id_inventaris}
              className="bg-[#0d2229] border border-[#15343d] p-5 rounded-2xl shadow-md"
            >
              <h3 className="text-base font-bold text-white">
                {item.nama_inventaris}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kategori: {item.kategori}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="px-3 py-1 bg-cyan-950 text-cyan-300 text-xs font-semibold rounded-md border border-cyan-800/40">
                  {item.jumlah} Unit Tersedia
                </span>
                <span className="text-[11px] text-slate-400">
                  Kondisi: {item.kondisi || "Baik"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
