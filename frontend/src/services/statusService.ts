import apiClient from "@/lib/apiClient";
import routes from "@/config/routes";
import { StudentStatus } from "@/types/student";

class StatusService {
  async fetchStatuses() {
    const response = await apiClient.get(routes.statuses);
    return response.data;
  }

  async addStatus(status: Omit<StudentStatus, "id">) {
    const response = await apiClient.post(routes.statuses, status);
    return response.data;
  }

  async updateStatus(updatedStatus: StudentStatus) {
    const response = await apiClient.put(routes.statuses, updatedStatus); 
    return response.data;
  }

  async deleteStatus(id: string) {
    const response = await apiClient.delete(`${routes.statuses}/${id}`);
    return response.data;
  }
}

const statusService = new StatusService();
export default statusService;
