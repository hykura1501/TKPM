import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";
import type { Program } from "@/types/student";

// Định nghĩa schema cho Program
const programSchema = z.object({
  id: z.string(),
  name: z.string(),
  faculty: z.string(),
});

// Kết nối MongoDB
async function getDb() {
  const client = await clientPromise;
  return client.db("student_dashboard").collection("programs");
}

// 📌 API lấy danh sách chương trình học
export async function GET() {
  try {
    const collection = await getDb();
    const programs = await collection.find({}).toArray();
    return NextResponse.json(programs, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách chương trình học:", error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách chương trình học" }, { status: 500 });
  }
}

// 📌 API thêm chương trình học (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = programSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const collection = await getDb();
    await collection.insertOne(parsed.data);
    const programs = await collection.find({}).toArray();

    return NextResponse.json({ message: "Thêm chương trình học thành công", programs: programs }, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi thêm chương trình học:", error);
    return NextResponse.json({ error: "Lỗi khi thêm chương trình học" }, { status: 500 });
  }
}

// 📌 API cập nhật chương trình học (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsed = programSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const collection = await getDb();
    await collection.updateOne({ id: parsed.data.id }, { $set: parsed.data });
    const programs = await collection.find({}).toArray();
    return NextResponse.json({ message: "Cập nhật chương trình học thành công", programs: programs }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật chương trình học:", error);
    return NextResponse.json({ error: "Lỗi khi cập nhật chương trình học" }, { status: 500 });
  }
}

// 📌 API xóa chương trình học (DELETE)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID không được để trống" }, { status: 400 });

    const collection = await getDb();
    await collection.deleteOne({ id });
    const programs = await collection.find({}).toArray();
    return NextResponse.json({ message: "Xóa chương trình học thành công", programs: programs }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xóa chương trình học:", error);
    return NextResponse.json({ error: "Lỗi khi xóa chương trình học" }, { status: 500 });
  }
}