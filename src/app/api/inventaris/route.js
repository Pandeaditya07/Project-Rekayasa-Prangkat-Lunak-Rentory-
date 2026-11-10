import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET: Ambil semua data inventaris
export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT * FROM inventaris ORDER BY id_inventaris DESC",
    );
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error("GET Inventaris Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// POST: Tambah data inventaris baru
export async function POST(req) {
  try {
    const body = await req.json();
    const nama = body.nama_inventaris || body.nama || "";
    const kategori = body.kategori || "Elektronik";
    const jumlah = Number(body.jumlah) || 1;
    const kondisi = body.kondisi || "Baik";

    await db.query(
      "INSERT INTO inventaris (nama_inventaris, kategori, jumlah, kondisi) VALUES (?, ?, ?, ?)",
      [nama, kategori, jumlah, kondisi],
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
    const nama = body.nama_inventaris || body.nama || "";
    const kategori = body.kategori || "Elektronik";
    const jumlah = Number(body.jumlah) || 1;
    const kondisi = body.kondisi || "Baik";

    await db.query(
      "UPDATE inventaris SET nama_inventaris=?, kategori=?, jumlah=?, kondisi=? WHERE id_inventaris=?",
      [nama, kategori, jumlah, kondisi, id],
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

    await db.query("DELETE FROM inventaris WHERE id_inventaris = ?", [id]);
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
