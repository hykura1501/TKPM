import apiClient from "@/lib/apiClient";
import routes from "@/config/routes";
import { Course } from "@/types/index";

class CourseService {
  async fetchCourses() {
    const response = await apiClient.get(routes.courses);
    return response.data;
  }

  async addCourse(course: Omit<Course, "id">) {
    const response = await apiClient.post(routes.courses, course);
    return response.data;
  }

  async updateCourse(updatedCourse: Course) {
    const response = await apiClient.put(routes.courses, updatedCourse);
    return response.data;
  }

  async deleteCourse(id: string) {
    const response = await apiClient.delete(`${routes.courses}/${id}`);
    return response.data;
  }

  async getTranslationCourseById(id: string) {
    const response = await apiClient.get(`${routes.courses}/${id}/translation`);
    return response.data;
  }

  async updateTranslationCourse(id: string, translation: any) {
    const response = await apiClient.put(`${routes.courses}/${id}/translation`, translation);
    return response.data;
  }
}

const courseService = new CourseService();
export default courseService;