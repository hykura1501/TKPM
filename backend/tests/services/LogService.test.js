const LogService = require("../../src/api/services/LogService");
const LogRepository = require("../../src/api/repositories/LogRepository");

jest.mock("../../src/api/repositories/LogRepository");

describe("LogService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mock calls after each test
  });

  describe("getListLogs", () => {
    it("should return a list of logs", async () => {
      const fakeLogs = [
        { timestamp: "2025-04-18T10:00:00Z", message: "Test log", level: "info" },
      ];
      LogRepository.findAll.mockResolvedValue(fakeLogs);

      const result = await LogService.getListLogs();

      expect(LogRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(fakeLogs);
    });
  });

  describe("addLog", () => {
    it("should add a new log if valid data is provided", async () => {
      const logData = {
        timestamp: "2025-04-18T10:00:00Z",
        message: "Test log",
        level: "info",
      };
      const fakeLog = { id: "1", ...logData };

      LogRepository.create.mockResolvedValue(fakeLog);

      const result = await LogService.addLog(logData);

      expect(LogRepository.create).toHaveBeenCalledWith(logData);
      expect(result).toEqual({
        message: "Thêm log thành công",
        log: fakeLog,
      });
    });

    it("should throw an error if data is invalid", async () => {
      const logData = {
        timestamp: "2025-04-18T10:00:00Z",
        message: "", // Invalid message
        level: "info",
      };

      await expect(LogService.addLog(logData)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: expect.any(Array), // Validation errors
        })
      );
      expect(LogRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error if level is invalid", async () => {
      const logData = {
        timestamp: "2025-04-18T10:00:00Z",
        message: "Test log",
        level: "invalid", // Invalid level
      };

      await expect(LogService.addLog(logData)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: expect.any(Array), // Validation errors
        })
      );
      expect(LogRepository.create).not.toHaveBeenCalled();
    });
  });
});