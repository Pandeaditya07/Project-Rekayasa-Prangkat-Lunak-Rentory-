import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        pr.id_peminjaman_ruang,
        u.nama AS peminjam,
        u.organisasi,
        g.nama_gedung,
        r.nama_ruangan,
        pr.nama_kegiatan,
        pr.tgl_mulai,
        pr.tgl_selesai,
        pr.status,
        pr.catatan_admin
      FROM peminjaman_ruang pr
      JOIN users u ON pr.id_user = u.id_user
      JOIN gedung g ON pr.id_gedung = g.id_gedung
      LEFT JOIN ruangan r ON pr.id_ruangan = r.id_ruangan
      ORDER BY pr.created_at DESC
    `);

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
