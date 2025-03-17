import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";
import type { Faculty } from "@/types/student";

// Định nghĩa schema cho Faculty
const facultySchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Kết nối MongoDB
async function getDb() {
  const client = await clientPromise;
  return client.db("student_dashboard").collection("faculties");
}

// 📌 API lấy danh sách khoa
export async function GET() {
  try {
    const collection = await getDb();
    const faculties = await collection.find({}).toArray();
    return NextResponse.json(faculties, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khoa:", error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách khoa" }, { status: 500 });
  }
}

// 📌 API thêm khoa (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = facultySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const collection = await getDb();
    await collection.insertOne(parsed.data);
    return NextResponse.json({ message: "Thêm khoa thành công", faculty: parsed.data }, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi thêm khoa:", error);
    return NextResponse.json({ error: "Lỗi khi thêm khoa" }, { status: 500 });
  }
}

// 📌 API cập nhật khoa (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsed = facultySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const collection = await getDb();
    await collection.updateOne({ id: parsed.data.id }, { $set: parsed.data });

    return NextResponse.json({ message: "Cập nhật khoa thành công" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật khoa:", error);
    return NextResponse.json({ error: "Lỗi khi cập nhật khoa" }, { status: 500 });
  }
}

// 📌 API xóa khoa (DELETE)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID không được để trống" }, { status: 400 });

    const collection = await getDb();
    await collection.deleteOne({ id });

    return NextResponse.json({ message: "Xóa khoa thành công" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xóa khoa:", error);
    return NextResponse.json({ error: "Lỗi khi xóa khoa" }, { status: 500 });
  }
}