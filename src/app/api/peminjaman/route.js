import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// 1. GET: Ambil semua data peminjaman + ekstrak organisasi dari form + daftar gedung/ruangan + statistik
export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT 
        pr.id_peminjaman_ruang,
        pr.id_user,
        u.nama AS peminjam,
        u.username,
        u.organisasi,
        g.nama_gedung,
        r.nama_ruangan,
        pr.nama_kegiatan,
        pr.tgl_mulai,
        pr.tgl_selesai,
        pr.status,
        pr.catatan_admin,
        pr.file_surat
      FROM peminjaman_ruang pr
      LEFT JOIN users u ON pr.id_user = u.id_user
      LEFT JOIN gedung g ON pr.id_gedung = g.id_gedung
      LEFT JOIN ruangan r ON pr.id_ruangan = r.id_ruangan
      ORDER BY pr.id_peminjaman_ruang DESC
    `);

    const formattedRows = rows.map((row) => {
      const rawKegiatan = row.nama_kegiatan || "";
      const matchOrg = rawKegiatan.match(/\(([^()]+)\)\s*$/);

      const organisasiPengaju = matchOrg
        ? matchOrg[1].trim()
        : row.organisasi || row.peminjam || "Mahasiswa";

      const kegiatanBersih = matchOrg
        ? rawKegiatan.replace(/\s*\([^()]+\)\s*$/, "").trim()
        : rawKegiatan;

      return {
        ...row,
        organisasi: organisasiPengaju,
        nama_kegiatan: kegiatanBersih,
      };
    });

    let gedungList = [];
    let ruanganList = [];
    try {
      const [gRows] = await db.query(
        `SELECT * FROM gedung ORDER BY nama_gedung ASC`,
      );
      gedungList = gRows;
    } catch (e) {
      console.error("Ambil list gedung error:", e.message);
    }

    try {
      const [rRows] = await db.query(
        `SELECT * FROM ruangan ORDER BY nama_ruangan ASC`,
      );
      ruanganList = rRows;
    } catch (e) {
      console.error("Ambil list ruangan error:", e.message);
    }

    const totalGedung = gedungList.length + ruanganList.length;

    let totalInventaris = 0;
    try {
      const [invRows] = await db.query(`SELECT * FROM inventaris`);
      totalInventaris = invRows.reduce((sum, r) => {
        const val = Math.max(
          Number(r.jumlah ?? 0),
          Number(r.jumlah_unit ?? 0),
          Number(r.jumlah_barang ?? 0),
          Number(r.jumlah_total ?? 0),
          Number(r.jumlah_tersedia ?? 0),
          Number(r.stok ?? 0),
          Number(r.stok_barang ?? 0),
          Number(r.tersedia ?? 0),
          Number(r.qty ?? 0),
          Number(r.kuantitas ?? 0),
        );
        return sum + val;
      }, 0);
    } catch (e) {
      console.error("Hitung inventaris error:", e.message);
    }

    return NextResponse.json({
      success: true,
      data: formattedRows,
      gedungList,
      ruanganList,
      stats: {
        totalGedung,
        totalInventaris,
      },
    });
  } catch (error) {
    console.error("GET Peminjaman Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// 2. POST: User mengajukan peminjaman baru + Simpan file surat PDF sebagai Base64 (kompatibel Vercel)
export async function POST(req) {
  try {
    const formData = await req.formData();

    let id_user = formData.get("id_user");
    let id_gedung = formData.get("id_gedung");
    const id_ruangan = formData.get("id_ruangan") || null;
    const nama_kegiatan = formData.get("nama_kegiatan") || "";
    const tgl_mulai = formData.get("tgl_mulai");
    const tgl_selesai = formData.get("tgl_selesai");
    const file = formData.get("file_surat");

    if (!id_user) {
      const [users] = await db.query(`SELECT id_user FROM users LIMIT 1`);
      id_user = users[0]?.id_user || 1;
    }

    if (!id_gedung) {
      const [gedungs] = await db.query(`SELECT id_gedung FROM gedung LIMIT 1`);
      id_gedung = gedungs[0]?.id_gedung || null;
    } else {
      const [cekGedung] = await db.query(
        `SELECT id_gedung FROM gedung WHERE id_gedung = ?`,
        [id_gedung],
      );
      if (cekGedung.length === 0) {
        const [gedungs] = await db.query(
          `SELECT id_gedung FROM gedung LIMIT 1`,
        );
        id_gedung = gedungs[0]?.id_gedung || null;
      }
    }

    let filePathDB = null;

    if (file && typeof file === "object" && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const mimeType = file.type || "application/pdf";
      filePathDB = `data:${mimeType};base64,${buffer.toString("base64")}`;
    }

    await db.query(
      `INSERT INTO peminjaman_ruang 
       (id_user, id_gedung, id_ruangan, nama_kegiatan, tgl_mulai, tgl_selesai, status, file_surat) 
       VALUES (?, ?, ?, ?, ?, ?, 'Pending', ?)`,
      [
        id_user,
        id_gedung,
        id_ruangan,
        nama_kegiatan,
        tgl_mulai,
        tgl_selesai,
        filePathDB,
      ],
    );

    return NextResponse.json({
      success: true,
      message: "Pengajuan peminjaman & surat berhasil dikirim!",
    });
  } catch (error) {
    console.error("POST Peminjaman Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// 3. PUT: Admin menyetujui atau menolak pengajuan
export async function PUT(req) {
  try {
    const { id_peminjaman_ruang, status, catatan_admin } = await req.json();

    await db.query(
      `UPDATE peminjaman_ruang 
       SET status = ?, catatan_admin = ? 
       WHERE id_peminjaman_ruang = ?`,
      [status, catatan_admin || null, id_peminjaman_ruang],
    );

    return NextResponse.json({
      success: true,
      message: `Status pengajuan berhasil diubah menjadi ${status}!`,
    });
  } catch (error) {
    console.error("PUT Peminjaman Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
