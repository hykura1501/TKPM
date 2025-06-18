import apiClient from "@/lib/apiClient";
import routes from "@/config/routes";
import { Student } from "@/types/student";
class StudentService {
  async fetchStudents() {
    try {
      const response = await apiClient.get(routes.students);
      return response.data;
    }
    catch (error) {
      //Ném lỗi ra ngoài để component con xử lý
      throw error;
    }
  }

  async addStudent(student: Omit<Student, "id" | "createdAt" | "updatedAt">) {
    const response = await apiClient.post(routes.students, student);
    return response.data;
  }

  async updateStudent(updatedStudent: Student) {
    const response = await apiClient.put(routes.students, updatedStudent);
    return response.data;
  }

  async deleteStudent(mssv: string) {
    const response = await apiClient.delete(`${routes.students}/${mssv}`);
    return response.data;
  }

  async importStudent(student: Student) {
    const response = await apiClient.post(routes.studentsImport, student);
    return response.data;
  }

  async getGradeByStudentId(studentId: string) { 
    const response = await apiClient.get(`${routes.students}/grades/${studentId}`);
    return response.data;
  }
  
  async importStudents(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    //Kiểm tra có phải file xml hoặc json không
    if (!file.name.endsWith(".xml") && !file.name.endsWith(".json")) {
      throw new Error("Invalid file format. Please upload an XML or JSON file.");
    }

    //kiểm tra kích thước file không quá 10MB
    // if (file.size > 10 * 1024 * 1024) // 10MB
    //   throw new Error("File size must not exceed 10MB");

    if (!file) {
      throw new Error("No file selected for import.");
    }
    if (file.size === 0) {
      throw new Error("File is empty. Please select a valid file.");
    }
    // Đính kèm kiểu dữ liệu vào formData
    formData.append("format", file.name.endsWith(".xml") ? "xml" : "json");

    const response = await apiClient.post(routes.studentsImport, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  }

  async exportStudents(format: "csv" | "json" | "xml" | "excel") {
    const response = await apiClient.get(routes.studentsExport, {
      params: { format },
      responseType: "blob", // Để nhận dữ liệu file
    });

    // Tạo URL cho file blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Tạo link để tải file
    const link = document.createElement("a");
    link.href = url;
    //Lấy tên file từ header hoặc đặt tên mặc định
    const contentDisposition = response.headers["content-disposition"];
    const filename = contentDisposition
      ? contentDisposition.split("filename=")[1].replace(/"/g, "")
      : `students.${format}`;
    console.log(filename)
    link.setAttribute("download", filename); // Tên file tải về
    document.body.appendChild(link);
    link.click();
    
    // Dọn dẹp sau khi tải xong
    document.body.removeChild(link);
  }
}

const studentService = new StudentService();
export default studentService;