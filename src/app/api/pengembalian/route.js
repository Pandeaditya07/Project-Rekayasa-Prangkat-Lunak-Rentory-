import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// 1. GET: Ambil daftar peminjaman yang sudah disetujui, sedang diproses kembali, atau selesai dikembalikan
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const idUser = searchParams.get("id_user");

    let query = `
      SELECT 
        pr.id_peminjaman_ruang,
        pr.id_user,
        u.nama AS nama_peminjam,
        u.username,
        u.organisasi,
        g.nama_gedung,
        r.nama_ruangan,
        pr.nama_kegiatan,
        pr.tgl_mulai,
        pr.tgl_selesai,
        pr.status,
        pr.penerima_kembali,
        pr.foto_pengembalian,
        pr.tgl_dikembalikan,
        pr.catatan_admin
      FROM peminjaman_ruang pr
      LEFT JOIN users u ON pr.id_user = u.id_user
      LEFT JOIN gedung g ON pr.id_gedung = g.id_gedung
      LEFT JOIN ruangan r ON pr.id_ruangan = r.id_ruangan
      WHERE pr.status IN ('Approved', 'Menunggu Pengembalian', 'Selesai')
    `;

    const params = [];
    if (idUser) {
      query += ` AND pr.id_user = ?`;
      params.push(idUser);
    }

    query += ` ORDER BY pr.id_peminjaman_ruang DESC`;

    const [rows] = await db.query(query, params);

    const formattedRows = rows.map((row) => {
      const rawKegiatan = row.nama_kegiatan || "";
      const matchOrg = rawKegiatan.match(/\(([^()]+)\)\s*$/);

      const organisasiPengaju = matchOrg
        ? matchOrg[1].trim()
        : row.organisasi || row.nama_peminjam || "Mahasiswa";

      const kegiatanBersih = matchOrg
        ? rawKegiatan.replace(/\s*\([^()]+\)\s*$/, "").trim()
        : rawKegiatan;

      // Tentukan nama barang / ruangan / gedung yang dipinjam
      let namaItem = kegiatanBersih;
      if (kegiatanBersih.startsWith("[INVENTARIS]")) {
        namaItem = kegiatanBersih.replace("[INVENTARIS]", "").trim();
      } else if (row.nama_ruangan) {
        namaItem = `${row.nama_ruangan} (${kegiatanBersih})`;
      } else if (row.nama_gedung) {
        namaItem = `${row.nama_gedung} (${kegiatanBersih})`;
      }

      return {
        ...row,
        organisasi: organisasiPengaju,
        nama_item: namaItem,
      };
    });

    return NextResponse.json({
      success: true,
      data: formattedRows,
    });
  } catch (error) {
    console.error("GET Pengembalian Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// 2. POST: User mengajukan pengembalian (nama penerima + foto kamera)
export async function POST(req) {
  try {
    const { id_peminjaman_ruang, penerima_kembali, foto_pengembalian } =
      await req.json();

    if (!id_peminjaman_ruang || !penerima_kembali || !foto_pengembalian) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama penerima dan foto dokumentasi wajib diisi!",
        },
        { status: 400 },
      );
    }

    await db.query(
      `UPDATE peminjaman_ruang 
       SET status = 'Menunggu Pengembalian',
           penerima_kembali = ?,
           foto_pengembalian = ?,
           tgl_dikembalikan = NOW()
       WHERE id_peminjaman_ruang = ?`,
      [penerima_kembali, foto_pengembalian, id_peminjaman_ruang],
    );

    return NextResponse.json({
      success: true,
      message:
        "Bukti pengembalian berhasil dikirim dan menunggu konfirmasi Admin!",
    });
  } catch (error) {
    console.error("POST Pengembalian Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// 3. PUT: Admin mengonfirmasi pengembalian selesai
export async function PUT(req) {
  try {
    const { id_peminjaman_ruang, catatan_admin } = await req.json();

    await db.query(
      `UPDATE peminjaman_ruang 
       SET status = 'Selesai',
           catatan_admin = COALESCE(?, catatan_admin)
       WHERE id_peminjaman_ruang = ?`,
      [catatan_admin || null, id_peminjaman_ruang],
    );

    return NextResponse.json({
      success: true,
      message: "Pengembalian telah dikonfirmasi selesai!",
    });
  } catch (error) {
    console.error("PUT Pengembalian Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
