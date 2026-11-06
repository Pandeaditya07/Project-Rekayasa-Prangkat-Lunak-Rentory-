"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [authMode, setAuthMode] = useState("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // SKENARIO 1: JIKA ADMIN
    if (identifier.toLowerCase() === "admin" && password === "admin123") {
      alert("Login Berhasil sebagai ADMIN! Mengalihkan ke Portal Admin...");
      router.push("/admin");
      return;
    }

    // SKENARIO 2: JIKA USER / PENGAJU
    if (identifier.length > 0 && password.length > 0) {
      alert(
        `Login Berhasil sebagai USER (${identifier})! Mengalihkan ke Dashboard User...`,
      );
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1b22] text-slate-100 flex items-center justify-center p-4 md:p-6 font-sans">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-[#14252e] border border-[#1e3440] rounded-3xl overflow-hidden shadow-2xl">
        {/* Branding Sisi Kiri */}
        <div className="bg-[#18343e] p-8 md:p-10 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#1e3440]">
          <div>
            <h1 className="text-4xl font-black text-white font-serif">
              Rentory
            </h1>
            <p className="text-cyan-400 font-semibold text-sm mt-2">
              Peminjaman inventaris, tertata rapi.
            </p>
          </div>
          <div className="my-6 p-4 bg-[#12222a]/60 rounded-2xl border border-cyan-500/20 text-xs text-slate-300 space-y-1">
            <p className="font-bold text-cyan-300">💡 Akses Pengujian Login:</p>
            <p>
              <strong>Admin:</strong> Username:{" "}
              <code className="text-cyan-400">admin</code> | Pass:{" "}
              <code className="text-cyan-400">admin123</code>
            </p>
            <p>
              <strong>User:</strong> Bebas (Contoh:{" "}
              <code className="text-cyan-400">aditya</code> /{" "}
              <code className="text-cyan-400">user123</code>)
            </p>
          </div>
          <span className="text-[11px] text-slate-500">
            © 2026 Rentory Capstone Team
          </span>
        </div>

        {/* Form Sisi Kanan */}
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="flex bg-[#0d1b22] p-1 rounded-xl mb-6 border border-[#1e3440]">
            <button
              onClick={() => setAuthMode("login")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                authMode === "login"
                  ? "bg-[#257585] text-white"
                  : "text-slate-400"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setAuthMode("register")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                authMode === "register"
                  ? "bg-[#257585] text-white"
                  : "text-slate-400"
              }`}
            >
              Daftar Akun
            </button>
          </div>

          {authMode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Masuk Portal
                </h2>
                <p className="text-xs text-slate-400">
                  Masukkan akun Admin atau Pengaju kamu.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Username / Email
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan username/email..."
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0d1b22] border border-[#213a48] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#0d1b22] border border-[#213a48] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2cb5c8] hover:bg-[#259eb0] text-slate-950 font-bold rounded-xl text-sm transition shadow-lg active:scale-95"
              >
                Masuk Sistem
              </button>
            </form>
          ) : (
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-white">
                Daftar Akun Pengaju
              </h2>
              <p className="text-xs text-slate-400">
                Isi Nama Lengkap, NIM/NIP, dan Organisasi untuk pendaftaran.
              </p>
              <button
                onClick={() => {
                  alert("Akun baru berhasil didaftarkan! Silakan masuk.");
                  setAuthMode("login");
                }}
                className="w-full py-2.5 bg-[#257585] text-white font-bold rounded-xl text-xs"
              >
                Simulasi Simpan Pendaftaran
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
