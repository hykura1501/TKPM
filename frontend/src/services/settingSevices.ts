import apiClient from "@/lib/apiClient";
import routes from "@/config/routes";

class SettingService {
    async fetchDomains() {
        const response = await apiClient.get(`${routes.settings}/domains`);
        return response.data;
    }

    async updateDomains(domains: any) {
        const response = await apiClient.patch(`${routes.settings}/domains`, {domains: domains});
        return response.data;
    }

    async fetchSettings() {
        const response = await apiClient.get(`${routes.settings}`);
        return response.data;
    }
}

const settingService = new SettingService();
export default settingService;