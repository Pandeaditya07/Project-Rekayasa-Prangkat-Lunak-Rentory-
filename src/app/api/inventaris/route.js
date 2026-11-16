import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Helper mendeteksi nama kolom asli pada tabel `inventaris` di MySQL
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

  // Cari kolom angka/stok apa pun di tabel inventaris (selain id)
  const jumlahCol =
    fields.find((f) =>
      [
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
      ].includes(f),
    ) ||
    cols.find(
      (c) =>
        c.Field !== idCol &&
        !c.Field.startsWith("id_") &&
        /int|decimal|float|double/i.test(c.Type),
    )?.Field;

  const kondisiCol = fields.find((f) =>
    ["kondisi", "status", "keadaan"].includes(f),
  );

  return { idCol, namaCol, kategoriCol, jumlahCol, kondisiCol };
}

// GET: Ambil semua data inventaris & normalkan key agar konsisten di frontend
export async function GET() {
  try {
    const { idCol, namaCol, kategoriCol, jumlahCol, kondisiCol } =
      await getInventarisColumns();

    const [rows] = await db.query(
      `SELECT * FROM inventaris ORDER BY ${idCol} DESC`,
    );

    const normalized = rows.map((row) => ({
      id_inventaris: row[idCol],
      nama_inventaris: row[namaCol] || "-",
      kategori: kategoriCol ? row[kategoriCol] || "Elektronik" : "Elektronik",
      // Jika tabel tidak punya kolom stok sama sekali, set null agar tidak dianggap "Stok Habis (0)"
      jumlah: jumlahCol ? Number(row[jumlahCol] ?? 0) : null,
      kondisi: kondisiCol ? row[kondisiCol] || "Baik" : "Baik",
    }));

    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    console.error("GET Inventaris Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// POST: Tambah data inventaris baru sesuai nama kolom asli di tabel
export async function POST(req) {
  try {
    const body = await req.json();
    const nama = body.nama_inventaris || body.nama_barang || body.nama || "";
    const kategori = body.kategori || "Elektronik";
    const jumlah = Number(body.jumlah ?? body.stok ?? 1);
    const kondisi = body.kondisi || "Baik";

    const { namaCol, kategoriCol, jumlahCol, kondisiCol } =
      await getInventarisColumns();

    const insertCols = [namaCol];
    const insertVals = [nama];

    if (kategoriCol) {
      insertCols.push(kategoriCol);
      insertVals.push(kategori);
    }
    if (jumlahCol) {
      insertCols.push(jumlahCol);
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
    const jumlah = Number(body.jumlah ?? body.stok ?? 1);
    const kondisi = body.kondisi || "Baik";

    const { idCol, namaCol, kategoriCol, jumlahCol, kondisiCol } =
      await getInventarisColumns();

    const updates = [`${namaCol} = ?`];
    const values = [nama];

    if (kategoriCol) {
      updates.push(`${kategoriCol} = ?`);
      values.push(kategori);
    }
    if (jumlahCol) {
      updates.push(`${jumlahCol} = ?`);
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
