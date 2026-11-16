import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper cek kolom tabel agar tidak error jika kolom kapasitas/fasilitas belum ada
async function ensureColumns(tableName) {
  const [cols] = await db.query(`SHOW COLUMNS FROM ${tableName}`);
  const fields = cols.map((c) => c.Field);

  if (!fields.includes("kapasitas")) {
    await db.query(
      `ALTER TABLE ${tableName} ADD COLUMN kapasitas INT DEFAULT 0`,
    );
  }
  if (!fields.includes("fasilitas")) {
    await db.query(
      `ALTER TABLE ${tableName} ADD COLUMN fasilitas VARCHAR(255) DEFAULT ''`,
    );
  }
}

// GET: Ambil seluruh daftar Gedung & Ruangan dari database
export async function GET() {
  try {
    await ensureColumns("gedung");
    await ensureColumns("ruangan");

    const [gedungRows] = await db.query(
      `SELECT id_gedung, nama_gedung, kapasitas, fasilitas FROM gedung ORDER BY id_gedung DESC`,
    );
    const [ruanganRows] = await db.query(
      `SELECT id_ruangan, id_gedung, nama_ruangan, kapasitas, fasilitas FROM ruangan ORDER BY id_ruangan DESC`,
    );

    const combined = [
      ...gedungRows.map((g) => ({
        uid: `gedung-${g.id_gedung}`,
        id: g.id_gedung,
        jenis: "Gedung",
        nama: g.nama_gedung,
        kapasitas: Number(g.kapasitas || 0),
        fasilitas: g.fasilitas || "-",
      })),
      ...ruanganRows.map((r) => ({
        uid: `ruangan-${r.id_ruangan}`,
        id: r.id_ruangan,
        id_gedung: r.id_gedung || null,
        jenis: "Ruang",
        nama: r.nama_ruangan,
        kapasitas: Number(r.kapasitas || 0),
        fasilitas: r.fasilitas || "-",
      })),
    ];

    return NextResponse.json({
      success: true,
      data: combined,
      gedungList: gedungRows,
      ruanganList: ruanganRows,
    });
  } catch (error) {
    console.error("GET Gedung/Ruangan Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// POST: Tambah Gedung atau Ruang baru dari Admin
export async function POST(req) {
  try {
    const { jenis, nama, kapasitas, fasilitas, id_gedung } = await req.json();
    const kap = Number(kapasitas) || 0;
    const fas = fasilitas || "-";

    if (jenis === "Ruang") {
      await ensureColumns("ruangan");
      const [cols] = await db.query(`SHOW COLUMNS FROM ruangan`);
      const fields = cols.map((c) => c.Field);

      if (fields.includes("id_gedung")) {
        let parentGedungId = id_gedung || null;
        if (!parentGedungId) {
          const [g] = await db.query(`SELECT id_gedung FROM gedung LIMIT 1`);
          parentGedungId = g[0]?.id_gedung || null;
        }
        await db.query(
          `INSERT INTO ruangan (id_gedung, nama_ruangan, kapasitas, fasilitas) VALUES (?, ?, ?, ?)`,
          [parentGedungId, nama, kap, fas],
        );
      } else {
        await db.query(
          `INSERT INTO ruangan (nama_ruangan, kapasitas, fasilitas) VALUES (?, ?, ?)`,
          [nama, kap, fas],
        );
      }
    } else {
      await ensureColumns("gedung");
      await db.query(
        `INSERT INTO gedung (nama_gedung, kapasitas, fasilitas) VALUES (?, ?, ?)`,
        [nama, kap, fas],
      );
    }

    return NextResponse.json({
      success: true,
      message: `${jenis} berhasil ditambahkan!`,
    });
  } catch (error) {
    console.error("POST Gedung/Ruangan Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// PUT: Edit Gedung atau Ruang
export async function PUT(req) {
  try {
    const { id, jenis, nama, kapasitas, fasilitas } = await req.json();
    const kap = Number(kapasitas) || 0;
    const fas = fasilitas || "-";

    if (jenis === "Ruang") {
      await ensureColumns("ruangan");
      await db.query(
        `UPDATE ruangan SET nama_ruangan = ?, kapasitas = ?, fasilitas = ? WHERE id_ruangan = ?`,
        [nama, kap, fas, id],
      );
    } else {
      await ensureColumns("gedung");
      await db.query(
        `UPDATE gedung SET nama_gedung = ?, kapasitas = ?, fasilitas = ? WHERE id_gedung = ?`,
        [nama, kap, fas, id],
      );
    }

    return NextResponse.json({
      success: true,
      message: `${jenis} berhasil diperbarui!`,
    });
  } catch (error) {
    console.error("PUT Gedung/Ruangan Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// DELETE: Hapus Gedung atau Ruang
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const jenis = searchParams.get("jenis");

    if (!id || !jenis) {
      return NextResponse.json(
        { success: false, message: "Parameter id dan jenis wajib diisi" },
        { status: 400 },
      );
    }

    if (jenis === "Ruang") {
      await db.query(`DELETE FROM ruangan WHERE id_ruangan = ?`, [id]);
    } else {
      await db.query(`DELETE FROM gedung WHERE id_gedung = ?`, [id]);
    }

    return NextResponse.json({
      success: true,
      message: `${jenis} berhasil dihapus!`,
    });
  } catch (error) {
    console.error("DELETE Gedung/Ruangan Error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal menghapus karena gedung/ruang masih dipakai pada riwayat peminjaman.",
      },
      { status: 500 },
    );
  }
}
