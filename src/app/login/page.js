"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    nama: "",
    username: "",
    email: "",
    password: "",
    organisasi: "",
    no_telp: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSwitchMode = (mode) => {
    setIsLogin(mode);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const endpoint = isLogin ? "/api/login" : "/api/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        if (isLogin) {
          if (data.user.role === "admin") {
            router.push("/admin");
          } else {
            // Arahkan ke rute dashboard utama user
            router.push("/user/dashboard");
          }
        } else {
          setSuccessMsg(
            "Registrasi berhasil! Silakan masuk dengan akun baru Anda.",
          );
          setIsLogin(true);
        }
      } else {
        setErrorMsg(data.message || "Terjadi kesalahan.");
      }
    } catch (err) {
      setErrorMsg("Gagal terhubung ke server database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#0a191d]">
      {/* Sisi Kiri - Branding Teal */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-[#15464e] p-12 text-white">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Rentory</h1>
        </div>
        <div className="mb-12">
          <h2 className="text-4xl font-bold leading-tight">
            Peminjaman
            <br />
            inventaris, tertata
          </h2>
          <p className="mt-4 text-sm text-[#8eb5bb]">
            Kelola pengajuan peminjaman gedung dan barang dengan mudah, cepat,
            dan transparan.
          </p>
        </div>
        <div className="text-xs text-[#8eb5bb]/60">
          © {new Date().getFullYear()} Rentory System
        </div>
      </div>

      {/* Sisi Kanan - Card Form Login / Register */}
      <div className="flex w-full items-center justify-center bg-[#0a191d] p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-2xl bg-[#0f262c] p-8 border border-[#1b3d45] shadow-2xl">
          {/* Switch Tab */}
          <div className="mb-6 flex border-b border-[#1b3d45] pb-2">
            <button
              type="button"
              onClick={() => handleSwitchMode(true)}
              className={`mr-6 pb-2 text-sm font-semibold transition ${
                isLogin
                  ? "border-b-2 border-emerald-400 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode(false)}
              className={`pb-2 text-sm font-semibold transition ${
                !isLogin
                  ? "border-b-2 border-emerald-400 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Daftar Akun
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">
              {isLogin ? "Masuk" : "Daftar"}
            </h3>
            <p className="mt-1 text-xs text-[#8eb5bb]">
              {isLogin
                ? "Silakan login untuk melanjutkan."
                : "Isi data berikut untuk mendaftar akun baru."}
            </p>
          </div>

          {/* Alert Message */}
          {errorMsg && (
            <div className="mb-4 rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-400 border border-emerald-500/20">
              {successMsg}
            </div>
          )}

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    required={!isLogin}
                    className="w-full rounded-lg bg-[#061215] border border-[#1b3d45] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Masukkan email"
                    required={!isLogin}
                    className="w-full rounded-lg bg-[#061215] border border-[#1b3d45] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-1 block text-xs text-slate-300">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Masukkan username"
                required
                className="w-full rounded-lg bg-[#061215] border border-[#1b3d45] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs text-slate-300">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                required
                className="w-full rounded-lg bg-[#061215] border border-[#1b3d45] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Organisasi
                  </label>
                  <input
                    type="text"
                    name="organisasi"
                    value={formData.organisasi}
                    onChange={handleChange}
                    placeholder="Contoh: BEM"
                    className="w-full rounded-lg bg-[#061215] border border-[#1b3d45] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    No. WhatsApp
                  </label>
                  <input
                    type="text"
                    name="no_telp"
                    value={formData.no_telp}
                    onChange={handleChange}
                    placeholder="0812345..."
                    className="w-full rounded-lg bg-[#061215] border border-[#1b3d45] px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-lg bg-[#195a64] py-3 text-sm font-semibold text-white transition hover:bg-[#1f6e7b] disabled:opacity-50"
            >
              {loading ? "Memproses..." : isLogin ? "Masuk" : "Daftar Akun"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button
              type="button"
              onClick={() => handleSwitchMode(!isLogin)}
              className="font-semibold text-emerald-400 hover:underline"
            >
              {isLogin ? "Daftar di sini" : "Login di sini"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
