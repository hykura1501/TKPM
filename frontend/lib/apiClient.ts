import axios from "axios";

// Cấu hình base URL
const apiClient = axios.create({
  baseURL: `${process.env.API_BASE_URL}/api`, // Thay đổi nếu cần
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Thêm interceptor để thêm `locale` vào header
apiClient.interceptors.request.use((config) => {
  // lấy từ cookie
  const locale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("NEXT_LOCALE="))
    ?.split("=")[1];

  // const locale = typeof window !== "undefined" ? localStorage.getItem("locale") || "vi" : "vi";

  // Gắn `locale` vào header `Accept-Language`
  config.headers["Accept-Language"] = locale;

  return config;
});

// Thêm interceptor để bắt lỗi
apiClient.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    console.error("Lỗi từ API:", error);
    return Promise.reject(error.response?.data.error || error.message);
  }
);


export default apiClient;
