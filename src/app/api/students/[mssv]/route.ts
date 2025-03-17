import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Kết nối MongoDB
async function getDb() {
    const client = await clientPromise;
    return client.db("student_dashboard").collection("students");
  }

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ mssv: string }> } // 👈 Đổi kiểu của `params` thành `Promise`
) {
  try {
    const resolvedParams = await context.params; // 👈 Chờ `params` resolve
    const { mssv } = resolvedParams;
  
    if (!mssv) {
      return NextResponse.json({ error: "Mssv không được để trống" }, { status: 400 });
    }

    const collection = await getDb(); 
    const student = await collection.findOne({ mssv });
    console.log(student);
    
    if (!student) {
      return NextResponse.json({ error: "Không tìm thấy sinh viên" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Lỗi khi lấy sinh viên:", error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
