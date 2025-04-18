import type { LogEntry } from "@/types/student"
import { toast } from "@/components/ui/use-toast"

// Hàm tạo ID ngẫu nhiên
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Hàm thêm log mới
export const addLogEntry = (logData: Omit<LogEntry, "id" | "timestamp">): LogEntry => {
  const newLog: LogEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    ...logData,
  }

  // Trong ứng dụng thực tế, có thể lưu log vào localStorage hoặc gửi lên server
  console.log("New log entry:", newLog)

  // Hiển thị toast khi có lỗi
  if (logData.action === "error") {
    toast({
      title: "Lỗi hệ thống",
      description: logData.details,
      variant: "destructive",
    })
  }

  return newLog
}

// Hàm lấy tất cả log
export const getLogs = (): LogEntry[] => {
  // Trong ứng dụng thực tế, có thể lấy log từ localStorage hoặc từ server
  return []
}

