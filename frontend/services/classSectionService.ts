import apiClient from "@/lib/apiClient";
import routes from "@/config/routes";
import { ClassSection } from "@/types/index";

class ClassSectionService {
  async fetchClassSections() {
    const response = await apiClient.get(routes.classSections);
    return response.data;
  }

  async fetchClassSectionByCourseId(courseId: string) { 
    const response = await apiClient.get(`${routes.classSections}/course/${courseId}`);
    return response.data;
  }

  async addClassSection(classSection: Omit<ClassSection, "id">) {
    const response = await apiClient.post(routes.classSections, classSection);
    return response.data;
  }

  async updateClassSection(updatedClassSection: ClassSection) {
    const response = await apiClient.put(routes.classSections, updatedClassSection)
    return response.data;
  }

  async deleteClassSection(id: string) {
    const response = await apiClient.delete(`${routes.classSections}/${id}`);
    return response.data;
  }

  async fetchClassesByCourseId(id: string) {
    const response = await apiClient.get(`${routes.classSections}/course/${id}`);
    return response.data;
  }
}

const classSectionService = new ClassSectionService();
export default classSectionService;