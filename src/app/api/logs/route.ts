import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";
import type { LogEntry } from "@/types/student";
import { metadata } from "@/app/layout";

// Định nghĩa schema cho LogEntry
const logEntrySchema = z.object({
  timestamp: z.string(),
  metadata: z.record(z.any()).optional(),
});

// Kết nối MongoDB
async function getDb() {
  const client = await clientPromise;
  return client.db("student_dashboard").collection("logs");
}

// 📌 API lấy danh sách log
export async function GET() {
  try {
    const collection = await getDb();
    const logs = await collection.find({}).toArray();
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách log:", error);
    return NextResponse.json({ error: "Lỗi khi lấy danh sách log" }, { status: 500 });
  }
}

// 📌 API thêm log (POST)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = logEntrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const collection = await getDb();
    await collection.insertOne(parsed.data);
    return NextResponse.json({ message: "Thêm log thành công", log: parsed.data }, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi thêm log:", error);
    return NextResponse.json({ error: "Lỗi khi thêm log" }, { status: 500 });
  }
}

// 📌 API cập nhật log (PUT)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const parsed = logEntrySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors }, { status: 400 });
    }

    const collection = await getDb();
    await collection.updateOne({ id: parsed.data.id }, { $set: parsed.data });

    return NextResponse.json({ message: "Cập nhật log thành công" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi cập nhật log:", error);
    return NextResponse.json({ error: "Lỗi khi cập nhật log" }, { status: 500 });
  }
}

// 📌 API xóa log (DELETE)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ID không được để trống" }, { status: 400 });

    const collection = await getDb();
    await collection.deleteOne({ id });

    return NextResponse.json({ message: "Xóa log thành công" }, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi xóa log:", error);
    return NextResponse.json({ error: "Lỗi khi xóa log" }, { status: 500 });
  }
}