import apiClient from "@/lib/apiClient";
import routes from "@/config/routes";
import { Semester } from "@/types/index";

class SemesterService {
  async fetchSemesters() {
    const response = await apiClient.get(routes.semesters);
    return response.data;
  }

  async addSemester(semester: Omit<Semester, "id">) {
    const response = await apiClient.post(routes.semesters, semester);
    return response.data;
  }

  async updateSemester(updatedSemester: Semester) {
    const response = await apiClient.put(routes.semesters, updatedSemester);
    return response.data;
  }

  async deleteSemester(id: string) {
    const response = await apiClient.delete(`${routes.semesters}/${id}`);
    return response.data;
  }
}

const semesterService = new SemesterService();
export default semesterService;