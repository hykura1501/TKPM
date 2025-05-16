import apiClient from "@/lib/apiClient";
import routes from "@/config/routes";
import { Program } from "@/types/student";

class ProgramService {
  async fetchPrograms() {
    const response = await apiClient.get(routes.programs);
    return response.data;
  }

  async addProgram(program: Omit<Program, "id">) {
    const response = await apiClient.post(routes.programs, program);
    return response.data;
  }

  async updateProgram(updatedProgram: Program) {
    const response = await apiClient.put(routes.programs, updatedProgram);
    return response.data;
  }

  async deleteProgram(id: string) {
    try{
      const response = await apiClient.delete(`${routes.programs}/${id}`);
      return response.data;
    }
    catch(error){
      console.error("Error deleting program:", error);
      throw error; // Ném lỗi để nơi gọi có thể xử lý tiếp
    }
  }

  async getTranslationProgramById(id: string) {
    const response = await apiClient.get(`${routes.programs}/${id}/translation`);
    return response.data;
  }

  async updateTranslationProgram(id: string, translation: any) {
    const response = await apiClient.put(`${routes.programs}/${id}/translation`, translation);
    return response.data;
  }
}

const programService = new ProgramService();
export default programService;