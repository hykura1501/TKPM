import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";
import { addLogEntry } from "@/lib/logging";

// Định nghĩa schema cho StudentStatus
const statusSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

// Kết nối MongoDB
async function getDb() {
  const client = await clientPromise;
  return client.db("student_dashboard").collection("statuses");
}

// 📌 API lấy danh sách tình trạng sinh viên
export async function GET() {
  try {
    const collection = await getDb();
    const statuses = await collection.find({}).toArray();
    return NextResponse.json(statuses, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tình trạng sinh viên:", error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách tình trạng sinh viên" }, { status: 500 });
  }
}

// 📌 API thêm tình trạng sinh viên (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = statusSchema.safeParse(body);

    if (!parsed.success) {
      await addLogEntry({
        message: "Thêm tình trạng sinh viên không hợp lệ",
        level: "warn",
      });
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const collection = await getDb();
    await collection.insertOne(parsed.data);
    const statuses = await collection.find({}).toArray();
    await addLogEntry({
      message: "Thêm tình trạng sinh viên",
      level: "info",
      action: "create",
      entity: "system",
      user: "admin",
      details: "Add new status: " + parsed.data.name,
    });
    return NextResponse.json({ message: "Thêm tình trạng sinh viên thành công", statuses: statuses }, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi thêm tình trạng sinh viên:", error);
    await addLogEntry({
      message: "Lỗi khi thêm tình trạng sinh viên",
      level: "error",
    });
    return NextResponse.json({ error: "Lỗi khi thêm tình trạng sinh viên" }, { status: 500 });
  }
}

// 📌 API cập nhật tình trạng sinh viên (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsed = statusSchema.safeParse(body);

    if (!parsed.success) {
      await addLogEntry({
        message: "Cập nhật tình trạng sinh viên không hợp lệ",
        level: "warn",
      });
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const collection = await getDb();
    await collection.updateOne({ id: parsed.data.id }, { $set: parsed.data });
    const statuses = await collection.find({}).toArray();
    await addLogEntry({
      message: "Cập nhật tình trạng sinh viên",
      level: "info",
      action: "update",
      entity: "system",
      user: "admin",
      details: "Updated status: " + parsed.data.name,
    });
    return NextResponse.json({ message: "Cập nhật tình trạng sinh viên thành công", statuses: statuses }, { status: 200 });

  } catch (error) {
    console.error("Lỗi khi cập nhật tình trạng sinh viên:", error);
    await addLogEntry({
      message: "Lỗi khi cập nhật tình trạng sinh viên",
      level: "error",
    });
    return NextResponse.json({ error: "Lỗi khi cập nhật tình trạng sinh viên" }, { status: 500 });
  }
}

// 📌 API xóa tình trạng sinh viên (DELETE)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      await addLogEntry({
        message: "ID không được để trống",
        level: "warn",
      });
      return NextResponse.json({ error: "ID không được để trống" }, { status: 400 });
    }

    const collection = await getDb();
    await collection.deleteOne({ id });
    const statuses = await collection.find({}).toArray();
    await addLogEntry({
      message: "Xóa tình trạng sinh viên",
      level: "info",
      action: "delete",
      entity: "system",
      entityId: id,
      user: "admin",
      details: `Deleted status: ${id}`,
    });
    return NextResponse.json({ message: "Xóa tình trạng sinh viên thành công", statuses: statuses }, { status: 200 });

  } catch (error) {
    console.error("Lỗi khi xóa tình trạng sinh viên:", error);
    await addLogEntry({
      message: "Lỗi khi xóa tình trạng sinh viên",
      level: "error",
    });
    return NextResponse.json({ error: "Lỗi khi xóa tình trạng sinh viên" }, { status: 500 });
  }
}