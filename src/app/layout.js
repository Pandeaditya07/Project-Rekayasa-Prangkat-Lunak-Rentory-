import "./globals.css";

export const metadata = {
  title: "Rentory - Sistem Peminjaman Inventaris & Gedung",
  description: "Aplikasi Manajemen Inventaris FMIPA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#0b171d] text-slate-100 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
