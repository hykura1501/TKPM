const StatusService = require("../../src/api/services/StatusService");
const StatusRepository = require("../../src/api/repositories/StatusRepository");
const StudentRepository = require("../../src/api/repositories/StudentRepository");
const { addLogEntry } = require("../../src/api/helpers/logging");

jest.mock("../../src/api/repositories/StatusRepository");
jest.mock("../../src/api/repositories/StudentRepository", () => ({
  findOneByCondition: jest.fn(),
}));
jest.mock("../../src/api/helpers/logging");

describe("StatusService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mock calls after each test
  });

  describe("getListStatuses", () => {
    it("should return a list of statuses", async () => {
      const fakeStatuses = [
        { id: "1", name: new Map([["vi", "Đang học"], ["en", "Active"]]), color: "green", allowedStatus: ["2"] },
        { id: "2", name: new Map([["vi", "Nghỉ học"], ["en", "Inactive"]]), color: "red", allowedStatus: [] }
      ];
      StatusRepository.findAll.mockResolvedValue(fakeStatuses);

      const result = await StatusService.getListStatuses("vi");

      expect(StatusRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { id: "1", name: "Đang học", color: "green", allowedStatus: ["2"] },
        { id: "2", name: "Nghỉ học", color: "red", allowedStatus: [] }
      ]);
    });
  });

  describe("addStatus", () => {
    it("should add a new status if valid data is provided", async () => {
      const statusData = { name: "Đang học", color: "green" };
      const fakeStatuses = [
        { id: "status-1", name: new Map([["vi", "Đang học"], ["en", "Active"]]), color: "green", allowedStatus: [] }
      ];

      StatusRepository.create.mockResolvedValue();
      StatusRepository.findAll.mockResolvedValue(fakeStatuses);

      const result = await StatusService.addStatus(statusData, "vi");

      // Kiểm tra name là Map và có giá trị đúng
      const callArg = StatusRepository.create.mock.calls[0][0];
      expect(callArg.name.get("vi")).toBe("Đang học");
      expect(callArg.color).toBe("green");

      expect(result).toEqual({
        message: "Thêm tình trạng sinh viên thành công",
        statuses: [
          { id: "status-1", name: "Đang học", color: "green", allowedStatus: [] }
        ],
      });
    });

    it("should throw an error if data is invalid", async () => {
      const statusData = { name: "", color: "" }; // Invalid data

      await expect(StatusService.addStatus(statusData, "vi")).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: expect.any(Array), // Validation errors
        })
      );
      expect(StatusRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("updateStatus", () => {
    it("should update an existing status if valid data is provided", async () => {
      const statusData = { id: "1", name: "Đã tốt nghiệp", color: "blue" };
      const fakeStatuses = [
        { id: "1", name: new Map([["vi", "Đã tốt nghiệp"], ["en", "Graduated"]]), color: "blue", allowedStatus: [] }
      ];

      // Mock status exists
      StatusRepository.findOneByCondition.mockResolvedValue({
        id: "1",
        name: new Map([["vi", "Đang học"], ["en", "Active"]]),
        color: "green",
        allowedStatus: []
      });
      StatusRepository.update.mockResolvedValue();
      StatusRepository.findAll.mockResolvedValue(fakeStatuses);

      const result = await StatusService.updateStatus(statusData, "vi");

      // Kiểm tra name là Map và có giá trị đúng
      const updateCallArg = StatusRepository.update.mock.calls[0][1];
      expect(updateCallArg.name.get("vi")).toBe("Đã tốt nghiệp");
      expect(updateCallArg.color).toBe("blue");

      expect(result).toEqual({
        message: "Cập nhật tình trạng sinh viên thành công",
        statuses: [
          { id: "1", name: "Đã tốt nghiệp", color: "blue", allowedStatus: [] }
        ],
      });
    });

    it("should throw an error if data is invalid", async () => {
      const statusData = { id: "1", name: "", color: "" }; // Invalid data

      await expect(StatusService.updateStatus(statusData, "vi")).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: expect.any(Array), // Validation errors
        })
      );
      expect(StatusRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteStatus", () => {
    it("should delete a status if it is not being used", async () => {
      const statusId = "1";
      const fakeStatuses = [
        { id: "2", name: new Map([["vi", "Nghỉ học"], ["en", "Inactive"]]), color: "red", allowedStatus: [] }
      ];

      StudentRepository.findOneByCondition.mockResolvedValue(null); // No students using the status
      StatusRepository.delete.mockResolvedValue();
      StatusRepository.findAll.mockResolvedValue(fakeStatuses);

      const result = await StatusService.deleteStatus(statusId, "vi");

      expect(StatusRepository.delete).toHaveBeenCalledWith(statusId);
      expect(result).toEqual({
        message: "Xóa tình trạng sinh viên thành công",
        statuses: [
          { id: "2", name: "Nghỉ học", color: "red", allowedStatus: [] }
        ],
      });
    });

    it("should throw an error if status is being used", async () => {
      const statusId = "1";

      StudentRepository.findOneByCondition.mockResolvedValue({ id: "student-1", status: "1" });

      await expect(StatusService.deleteStatus(statusId, "vi")).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: "Không thể xóa tình trạng sinh viên đang được sử dụng",
        })
      );
      expect(StatusRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw an error if status ID is not provided", async () => {
      await expect(StatusService.deleteStatus(null, "vi")).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: "MSSV không được để trống",
        })
      );
      expect(StatusRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("updateStatusRules", () => {
    it("should update status transition rules", async () => {
      const statusRules = JSON.stringify([
        { fromStatus: "1", toStatus: ["2", "3"] },
        { fromStatus: "2", toStatus: ["3"] },
      ]);

      StatusRepository.update.mockResolvedValue();

      const result = await StatusService.updateStatusRules(statusRules);

      expect(StatusRepository.update).toHaveBeenCalledWith("1", { allowedStatus: ["2", "3"] });
      expect(StatusRepository.update).toHaveBeenCalledWith("2", { allowedStatus: ["3"] });
      expect(result).toEqual({ message: "Cập nhật quy tắc cho trạng thái thành công" });
    });
  });

  describe("getStatusRules", () => {
    it("should return status transition rules", async () => {
      const fakeStatuses = [
        { id: "1", allowedStatus: ["2", "3"] },
        { id: "2", allowedStatus: ["3"] },
      ];

      StatusRepository.findAll.mockResolvedValue(fakeStatuses);

      const result = await StatusService.getStatusRules();

      expect(StatusRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        { fromStatus: "1", toStatus: ["2", "3"] },
        { fromStatus: "2", toStatus: ["3"] },
      ]);
    });
  });

  describe("statusExists", () => {
    it("should return true if status exists", async () => {
      StatusRepository.findOneByCondition.mockResolvedValue({ id: "1" });

      const exists = await StatusService.statusExists("1");

      expect(StatusRepository.findOneByCondition).toHaveBeenCalledWith({ id: "1" });
      expect(exists).toBe(true);
    });

    it("should return false if status does not exist", async () => {
      StatusRepository.findOneByCondition.mockResolvedValue(null);

      const exists = await StatusService.statusExists("999");

      expect(StatusRepository.findOneByCondition).toHaveBeenCalledWith({ id: "999" });
      expect(exists).toBe(false);
    });
  });
});
