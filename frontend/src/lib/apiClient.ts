import axios from "axios";
import config from "../config";

// Cấu hình base URL
const apiClient = axios.create({
  baseURL: `${config.api.baseUrl}/api`, // Thay đổi nếu cần
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Thêm interceptor để bắt lỗi
// apiClient.interceptors.response.use(
//   (response: any) => {
//     return response;
//   },
//   (error: any) => {
//     console.error("Lỗi từ API:", error);
//     return Promise.reject(error);
//   }
// );


export default apiClient;
