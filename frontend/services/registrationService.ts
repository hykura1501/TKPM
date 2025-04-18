import apiClient from "@/lib/apiClient";
import routes from "@/config/routes";
import { Registration } from "@/types/index";

class RegistrationService {
  async fetchRegistrations() {
    const response = await apiClient.get(routes.registrations);
    return response.data;
  }

  async addRegistration(registration: Omit<Registration, "id">) {
    const response = await apiClient.post(routes.registrations, registration);
    return response.data;
  }

  async updateRegistration(updatedRegistration: Registration) {
    const response = await apiClient.put(routes.registrations, updatedRegistration);
    return response.data;
  }

  async deleteRegistration(id: string) {
    const response = await apiClient.delete(`${routes.registrations}/${id}`);
    return response.data;
  }

  async cancelRegistration(id: string) {
    const response = await apiClient.patch(`${routes.registrations}/${id}/cancel`);
    return response.data;
  }

  async fetchGradesByClassId(id: string) {
    const response = await apiClient.get(`${routes.registrations}/grade/${id}`);
    return response.data;
  }

  async saveGradesByClassId(id: string, grades: { [key: string]: string }) {
    const response = await apiClient.post(`${routes.registrations}/grade/${id}`, { grades: grades });
    return response.data;
  }
}

const registrationService = new RegistrationService();
export default registrationService;