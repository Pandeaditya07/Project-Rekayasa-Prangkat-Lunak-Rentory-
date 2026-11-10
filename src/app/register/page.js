"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    organisasi: "",
    no_telp: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        alert("Registrasi berhasil! Silakan login.");
        router.push("/login"); // Arahkan ke halaman login
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan server saat mendaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-850 p-8 shadow-2xl">
        <h2 className="mb-2 text-center text-2xl font-bold text-white">
          Buat Akun Rentory
        </h2>
        <p className="mb-6 text-center text-sm text-slate-400">
          Daftar untuk mengajukan peminjaman ruangan & barang
        </p>

        {errorMsg && (
          <div className="mb-4 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-400 border border-rose-500/20 text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              value={formData.nama}
              onChange={handleChange}
              placeholder="Contoh: Budi Santoso"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="budi123"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">
                No. WhatsApp/Telp
              </label>
              <input
                type="text"
                name="no_telp"
                value={formData.no_telp}
                onChange={handleChange}
                placeholder="08123456789"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">
              Email Active
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="budi@student.ac.id"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">
              Organisasi / UKM
            </label>
            <input
              type="text"
              name="organisasi"
              value={formData.organisasi}
              onChange={handleChange}
              placeholder="Contoh: BEM FMIPA / HIMA"
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase text-slate-400">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50 mt-2"
          >
            {loading ? "Mendaftarkan..." : "Daftar Akun Baru"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-400 hover:underline"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
