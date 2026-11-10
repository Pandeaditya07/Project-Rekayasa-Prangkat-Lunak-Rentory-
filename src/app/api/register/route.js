import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const { nama, username, email, password, organisasi, no_telp } =
      await request.json();

    // Validasi input tidak boleh kosong
    if (!nama || !username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Semua kolom wajib diisi!" },
        { status: 400 },
      );
    }

    // 1. Cek apakah username atau email sudah pernah terdaftar
    const [existingUsers] = await db.query(
      "SELECT id_user FROM users WHERE username = ? OR email = ?",
      [username, email],
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, message: "Username atau Email sudah terdaftar!" },
        { status: 400 },
      );
    }

    // 2. Simpan user baru ke database (default role: 'user')
    // Untuk dummy/pengembangan awal, password disimpan langsung
    const [result] = await db.query(
      `INSERT INTO users (nama, username, email, password_hash, role, organisasi, no_telp) 
       VALUES (?, ?, ?, ?, 'user', ?, ?)`,
      [nama, username, email, password, organisasi || null, no_telp || null],
    );

    return NextResponse.json({
      success: true,
      message: "Registrasi berhasil! Silakan login.",
      userId: result.insertId,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
