"use client";

import { useState, useEffect } from "react";
import UserSidebar from "@/components/userSidebar";

export default function UserLayout({ children }) {
  const [userName, setUserName] = useState("Mahasiswa");

  useEffect(() => {
    const syncUser = () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        const displayName = savedUser.nama || savedUser.username;
        if (displayName) {
          setUserName(displayName);
        }
      } catch {
        // abaikan jika JSON tidak valid
      }
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  return (
    <div className="flex h-screen w-full bg-[#071418] text-slate-100 overflow-hidden">
      {/* Sidebar Kiri - Posisi Tetap (Fixed Height) */}
      <UserSidebar />

      {/* Konten Sisi Kanan */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Banner Header Teal Atas - Otomatis mengikuti nama akun yang login */}
        <header className="bg-[#18535e] px-8 py-5 flex items-center justify-between shadow-md shrink-0 z-10">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Halo Selamat Datang, {userName}!
          </h1>
        </header>

        {/* Area Isi Halaman - Hanya bagian ini yang bisa di-scroll */}
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
