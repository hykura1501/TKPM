import apiClient from "@/lib/apiClient";
import routes from "@/config/routes";
import { Faculty } from "@/types/student";

class FacultyService {
  async fetchFaculties() {
    const response = await apiClient.get(routes.faculties);
    return response.data;
  }

  async addFaculty(faculty: Omit<Faculty, "id">) {
    const response = await apiClient.post(routes.faculties, faculty);
    return response.data;
  }

  async updateFaculty(updatedFaculty: Faculty) {
    const response = await apiClient.put(routes.faculties, updatedFaculty);
    return response.data;
  }

  async deleteFaculty(id: string) {
    const response = await apiClient.delete(`${routes.faculties}/${id}`);
    return response.data;
  }

  async getTranslationFacultyById(id: string) {
    const response = await apiClient.get(`${routes.faculties}/${id}/translation`);
    return response.data;
  }

  async updateTranslationFaculty(id: string, translation: any) {
    const response = await apiClient.put(`${routes.faculties}/${id}/translation`, translation);
    return response.data;
  }
}

const facultyService = new FacultyService();
export default facultyService;