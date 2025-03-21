import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";
import { addLogEntry } from "@/lib/logging";

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
async function isUse(id: string) {
  const client = await clientPromise;
  const collection = client.db("student_dashboard").collection("students");
  const student = await collection.findOne({
    facultyId: id,
  });
  return student ? true : false;
}

// 📌 API lấy danh sách khoa
export async function GET() {
  try {
    const collection = await getDb();
    const faculties = await collection.find({}).toArray();
    return NextResponse.json(faculties, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khoa:", error);
    await addLogEntry({
      
      message: "Lỗi khi lấy danh sách khoa",
      level: "error",
    });
    return NextResponse.json({ error: "Lỗi khi lấy danh sách khoa" }, { status: 500 });
  }
}

// 📌 API thêm khoa (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = facultySchema.safeParse(body);

    if (!parsed.success) {
      await addLogEntry({
        message: "Thêm khoa không hợp lệ",
        level: "warn",
      });
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const collection = await getDb();
    await collection.insertOne(parsed.data);
    const faculties = await collection.find({}).toArray();
    await addLogEntry({
      message: "Thêm khoa thành công",
      level: "info",
      action: "update",
      entity: "system",
      user: "admin",
      details: "Add new faculty: " + parsed.data.name,
    });
    return NextResponse.json({ message: "Thêm khoa thành công", faculties: faculties }, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi thêm khoa:", error);
    await addLogEntry({
      message: "Lỗi khi thêm khoa",
      level: "error",
    });
    return NextResponse.json({ error: "Lỗi khi thêm khoa" }, { status: 500 });
  }
}

// 📌 API cập nhật khoa (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsed = facultySchema.safeParse(body);

    if (!parsed.success) {
      await addLogEntry({
        message: "Cập nhật khoa không hợp lệ",
        level: "warn",
      });
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const collection = await getDb();
    await collection.updateOne({ id: parsed.data.id }, { $set: parsed.data });
    const faculties = await collection.find({}).toArray();
    await addLogEntry({
      message: "Cập nhật khoa thành công",
      level: "info",
      action: "update",
      entity: "system",
      user: "admin",
      details: "Update faculty: " + parsed.data.name,
    });
    return NextResponse.json({ message: "Cập nhật khoa thành công", faculties: faculties }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật khoa:", error);
    await addLogEntry({
      message: "Lỗi khi cập nhật khoa",
      level: "error",
    });
    return NextResponse.json({ error: "Lỗi khi cập nhật khoa" }, { status: 500 });
  }
}

// 📌 API xóa khoa (DELETE)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID không được để trống" }, { status: 400 });

    const collection = await getDb();
    const isUseFaculty = await isUse(id);
    if (isUseFaculty) {
      await addLogEntry({
        message: "Không thể xóa khoa đang được sử dụng",
        level: "warn",
      });
      return NextResponse.json({ error: "Không thể xóa khoa đang được sử dụng" }, { status: 400 });
    }

    await collection.deleteOne({ id });
    const faculties = await collection.find({}).toArray();
    await addLogEntry({
      message: "Xóa khoa thành công",
      level: "info",
      action: "delete",
      entity: "system",
      user: "admin",
      details: "Delete faculty: " + id,
    });
    return NextResponse.json({ message: "Xóa khoa thành công", faculties: faculties }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xóa khoa:", error);
    await addLogEntry({
      message: "Lỗi khi xóa khoa",
      level: "error",
    });
    return NextResponse.json({ error: "Lỗi khi xóa khoa" }, { status: 500 });
  }
}