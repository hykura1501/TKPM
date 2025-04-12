import apiClient from "@/lib/apiClient";
import routes from "@/config/routes";
import { Registration } from "@/types/index";

class RegistrationService {
  async fetchRegistrations() {
    const response = await apiClient.get(routes.registrations);
    return response.data;
  }

  async addRegistration(faculty: Omit<Registration, "id">) {
    const response = await apiClient.post(routes.registrations, faculty);
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
}

const facultyService = new RegistrationService();
export default facultyService;