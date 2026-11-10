import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    // 1. Cari user berdasarkan username di MySQL
    const [rows] = await db.query(
      "SELECT id_user, nama, username, password_hash, role FROM users WHERE username = ?",
      [username],
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Username atau password salah!" },
        { status: 401 },
      );
    }

    const user = rows[0];

    // 2. Bandingkan password input dengan password_hash yang tersimpan di MySQL
    if (password !== user.password_hash) {
      return NextResponse.json(
        { success: false, message: "Username atau password salah!" },
        { status: 401 },
      );
    }

    // 3. Jika cocok, izinkan masuk
    return NextResponse.json({
      success: true,
      message: "Login berhasil!",
      user: {
        id: user.id_user,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
