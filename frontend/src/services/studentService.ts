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
}

const studentService = new StudentService();
export default studentService;