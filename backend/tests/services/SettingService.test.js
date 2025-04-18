const SettingService = require("../../src/api/services/SettingService");
const SettingRepository = require("../../src/api/repositories/SettingRepository");
const StatusRepository = require("../../src/api/repositories/StatusRepository");
const { addLogEntry } = require("../../src/api/helpers/logging");
const generateStatusTransitionRules = require("../../src/api/helpers/statusRule");

jest.mock("../../src/api/repositories/SettingRepository");
jest.mock("../../src/api/repositories/StatusRepository");
jest.mock("../../src/api/helpers/logging");
jest.mock("../../src/api/helpers/statusRule");

describe("SettingService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mock calls after each test
  });

  describe("updateDomains", () => {
    it("should update domains if valid data is provided", async () => {
      const domains = ["example.com", "test.com"];

      SettingRepository.update.mockResolvedValue();

      const result = await SettingService.updateDomains(domains);

      expect(SettingRepository.update).toHaveBeenCalledWith(
        "67e69a34c85ca96947abaae3",
        { allowDomains: domains }
      );
      expect(addLogEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Cập nhật domain thành công",
          level: "info",
        })
      );
      expect(result).toEqual({ message: "Cập nhật domain thành công" });
    });

    it("should throw an error if domains list is empty", async () => {
      await expect(SettingService.updateDomains([])).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: "Danh sách domain không được để trống",
        })
      );
      expect(SettingRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("getDomains", () => {
    it("should return domains if settings exist", async () => {
      const mockSetting = { allowDomains: ["example.com", "test.com"] };
      SettingRepository.findOneByCondition.mockResolvedValue(mockSetting);

      const result = await SettingService.getDomains();

      expect(SettingRepository.findOneByCondition).toHaveBeenCalledWith({
        _id: "67e69a34c85ca96947abaae3",
      });
      expect(result).toEqual({ domains: mockSetting.allowDomains });
    });

    it("should throw an error if settings do not exist", async () => {
      SettingRepository.findOneByCondition.mockResolvedValue(null);

      await expect(SettingService.getDomains()).rejects.toThrow(
        "Không tìm thấy cài đặt domain"
      );
    });
  });

  describe("updatePhoneFormats", () => {
    it("should update phone formats if valid data is provided", async () => {
      const phoneFormats = JSON.stringify(["+84", "+1"]);

      SettingRepository.update.mockResolvedValue();

      const result = await SettingService.updatePhoneFormats(phoneFormats);

      expect(SettingRepository.update).toHaveBeenCalledWith(
        "67e69a34c85ca96947abaae3",
        { allowPhones: ["+84", "+1"] }
      );
      expect(addLogEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Cập nhật phone formats thành công",
          level: "info",
        })
      );
      expect(result).toEqual({ message: "Cập nhật phone formats thành công" });
    });

    it("should throw an error if phone formats list is empty", async () => {
      const phoneFormats = JSON.stringify([]);

      await expect(
        SettingService.updatePhoneFormats(phoneFormats)
      ).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: "Danh sách phone formats không được để trống",
        })
      );
      expect(SettingRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("getAllSettings", () => {
    it("should return all settings if they exist", async () => {
      const mockSetting = {
        allowDomains: ["example.com"],
        allowPhones: ["+84"],
      };
      const mockStatuses = [
        { id: "1", allowedStatus: ["2", "3"] },
        { id: "2", allowedStatus: ["3"] },
      ];

      SettingRepository.findOneByCondition.mockResolvedValue(mockSetting);
      StatusRepository.findAll.mockResolvedValue(mockStatuses);

      const result = await SettingService.getAllSettings();

      expect(SettingRepository.findOneByCondition).toHaveBeenCalledWith({
        _id: "67e69a34c85ca96947abaae3",
      });
      expect(StatusRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual({
        statusTransitionRules: [
          { fromStatus: "1", toStatus: ["2", "3"] },
          { fromStatus: "2", toStatus: ["3"] },
        ],
        allowedEmailDomains: mockSetting.allowDomains,
        phoneFormats: mockSetting.allowPhones,
      });
    });

    it("should throw an error if settings do not exist", async () => {
      SettingRepository.findOneByCondition.mockResolvedValue(null);

      await expect(SettingService.getAllSettings()).rejects.toThrow(
        "Không tìm thấy cài đặt"
      );
    });
  });

  describe("getStatusRules", () => {
    it("should return status transition rules", async () => {
      const mockStatuses = [
        { id: "1", allowedStatus: ["2", "3"] },
        { id: "2", allowedStatus: ["3"] },
      ];
      const mockRules = [
        { fromStatus: "1", toStatus: ["2", "3"] },
        { fromStatus: "2", toStatus: ["3"] },
      ];

      StatusRepository.findAll.mockResolvedValue(mockStatuses);
      generateStatusTransitionRules.mockReturnValue(mockRules);

      const result = await SettingService.getStatusRules();

      expect(StatusRepository.findAll).toHaveBeenCalled();
      expect(generateStatusTransitionRules).toHaveBeenCalledWith(mockStatuses);
      expect(result).toEqual(mockRules);
    });
  });
});