import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const STOK_CANDIDATES = [
  "jumlah",
  "jumlah_unit",
  "jumlah_barang",
  "jumlah_total",
  "jumlah_tersedia",
  "stok",
  "stok_barang",
  "tersedia",
  "qty",
  "kuantitas",
  "total",
  "unit",
];

// Helper mendeteksi nama kolom asli pada tabel `inventaris` di MySQL/TiDB
async function getInventarisColumns() {
  const [cols] = await db.query("SHOW COLUMNS FROM inventaris");
  const fields = cols.map((c) => c.Field);

  const idCol =
    fields.find((f) =>
      ["id_inventaris", "id", "id_barang", "kode_inventaris"].includes(f),
    ) || fields[0];

  const namaCol =
    fields.find((f) =>
      [
        "nama_inventaris",
        "nama_barang",
        "nama",
        "nama_item",
        "item",
        "barang",
      ].includes(f),
    ) || fields[1];

  const kategoriCol = fields.find((f) =>
    ["kategori", "jenis", "tipe"].includes(f),
  );

  // Kumpulkan SEMUA kolom stok/jumlah yang ada di tabel
  let jumlahCols = fields.filter((f) => STOK_CANDIDATES.includes(f));

  if (jumlahCols.length === 0) {
    const intCol = cols.find(
      (c) =>
        c.Field !== idCol &&
        !c.Field.startsWith("id_") &&
        /int|decimal|float|double/i.test(c.Type),
    )?.Field;
    if (intCol) jumlahCols = [intCol];
  }

  const kondisiCol = fields.find((f) =>
    ["kondisi", "status", "keadaan"].includes(f),
  );

  return { idCol, namaCol, kategoriCol, jumlahCols, kondisiCol };
}

// GET: Ambil semua data inventaris + hitung otomatis stok tersedia
export async function GET() {
  try {
    const { idCol, namaCol, kategoriCol, jumlahCols, kondisiCol } =
      await getInventarisColumns();

    const [rows] = await db.query(
      `SELECT * FROM inventaris ORDER BY ${idCol} DESC`,
    );

    // Hitung barang inventaris yang sedang dipinjam (status Approved / Menunggu Pengembalian)
    let activeLoans = [];
    try {
      const [loanRows] = await db.query(
        `SELECT nama_kegiatan FROM peminjaman_ruang 
         WHERE status IN ('Approved', 'Menunggu Pengembalian') 
           AND UPPER(nama_kegiatan) LIKE '[INVENTARIS]%'`,
      );
      activeLoans = loanRows.map((l) => (l.nama_kegiatan || "").toLowerCase());
    } catch {
      activeLoans = [];
    }

    const normalized = rows.map((row) => {
      const namaBarang = row[namaCol] || "-";

      // Ambil nilai terbesar dari kolom stok yang tersedia agar tidak tertimpa kolom 0
      const totalJumlah =
        jumlahCols.length > 0
          ? Math.max(...jumlahCols.map((col) => Number(row[col] ?? 0)))
          : 0;

      // Hitung berapa unit barang ini yang sedang dipinjam aktif
      const dipinjamCount = activeLoans.filter((keg) =>
        keg.includes(namaBarang.toLowerCase()),
      ).length;

      const tersedia = Math.max(0, totalJumlah - dipinjamCount);

      return {
        id_inventaris: row[idCol],
        nama_inventaris: namaBarang,
        kategori: kategoriCol ? row[kategoriCol] || "Elektronik" : "Elektronik",
        jumlah: totalJumlah,
        tersedia,
        kondisi: kondisiCol ? row[kondisiCol] || "Baik" : "Baik",
      };
    });

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    console.error("GET Inventaris Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// POST: Tambah data inventaris baru & isi semua kolom jumlah/stok yang ada
export async function POST(req) {
  try {
    const body = await req.json();
    const nama = body.nama_inventaris || body.nama_barang || body.nama || "";
    const kategori = body.kategori || "Elektronik";
    const jumlah = Number(body.jumlah ?? body.stok ?? 0);
    const kondisi = body.kondisi || "Baik";

    const { namaCol, kategoriCol, jumlahCols, kondisiCol } =
      await getInventarisColumns();

    const insertCols = [namaCol];
    const insertVals = [nama];

    if (kategoriCol) {
      insertCols.push(kategoriCol);
      insertVals.push(kategori);
    }
    for (const col of jumlahCols) {
      insertCols.push(col);
      insertVals.push(jumlah);
    }
    if (kondisiCol) {
      insertCols.push(kondisiCol);
      insertVals.push(kondisi);
    }

    const placeholders = insertCols.map(() => "?").join(", ");
    await db.query(
      `INSERT INTO inventaris (${insertCols.join(", ")}) VALUES (${placeholders})`,
      insertVals,
    );

    return NextResponse.json({
      success: true,
      message: "Inventaris berhasil ditambahkan!",
    });
  } catch (error) {
    console.error("POST Inventaris Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// PUT: Edit/Update data inventaris
export async function PUT(req) {
  try {
    const body = await req.json();
    const id = body.id_inventaris || body.id;
    const nama = body.nama_inventaris || body.nama_barang || body.nama || "";
    const kategori = body.kategori || "Elektronik";
    const jumlah = Number(body.jumlah ?? body.stok ?? 0);
    const kondisi = body.kondisi || "Baik";

    const { idCol, namaCol, kategoriCol, jumlahCols, kondisiCol } =
      await getInventarisColumns();

    const updates = [`${namaCol} = ?`];
    const values = [nama];

    if (kategoriCol) {
      updates.push(`${kategoriCol} = ?`);
      values.push(kategori);
    }
    for (const col of jumlahCols) {
      updates.push(`${col} = ?`);
      values.push(jumlah);
    }
    if (kondisiCol) {
      updates.push(`${kondisiCol} = ?`);
      values.push(kondisi);
    }

    values.push(id);

    await db.query(
      `UPDATE inventaris SET ${updates.join(", ")} WHERE ${idCol} = ?`,
      values,
    );

    return NextResponse.json({
      success: true,
      message: "Inventaris berhasil diperbarui!",
    });
  } catch (error) {
    console.error("PUT Inventaris Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// DELETE: Hapus data inventaris
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "ID Inventaris tidak ditemukan" },
        { status: 400 },
      );
    }

    const { idCol } = await getInventarisColumns();
    await db.query(`DELETE FROM inventaris WHERE ${idCol} = ?`, [id]);

    return NextResponse.json({
      success: true,
      message: "Inventaris berhasil dihapus!",
    });
  } catch (error) {
    console.error("DELETE Inventaris Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
