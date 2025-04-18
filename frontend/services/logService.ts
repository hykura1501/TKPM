import apiClient from "@/lib/apiClient";
import routes from "@/config/routes";
import { LogEntry } from "@/types/student";

class LogService {
  async fetchLogs() {
    const response = await apiClient.get(routes.logs);
    return response.data;
  }

  async addLog(log: Omit<LogEntry, "id" | "createdAt" | "updatedAt">) {
    const response = await apiClient.post(routes.logs, log);
    return response.data;
  }
}

const logService = new LogService();
export default logService;