const RegistrationService = require("../../src/api/services/RegistrationService");
const RegistrationRepository = require("../../src/api/repositories/RegistrationRepository");
const StudentRepository = require("../../src/api/repositories/StudentRepository");
const ClassSectionRepository = require("../../src/api/repositories/ClassSectionRepository");
const { addLogEntry } = require("../../src/api/helpers/logging");

jest.mock("../../src/api/repositories/RegistrationRepository");
jest.mock("../../src/api/repositories/StudentRepository", () => ({
  findStudentByMssv: jest.fn(),
  findOneByCondition: jest.fn(),
}));
jest.mock("../../src/api/repositories/ClassSectionRepository", () => ({
  findOneByCondition: jest.fn(),
  update: jest.fn(),
}));
jest.mock("../../src/api/helpers/logging");

describe("RegistrationService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mock calls after each test
  });

  describe("getListRegistrations", () => {
    it("should return a list of registrations", async () => {
      const fakeRegistrations = [
        { id: "1", studentId: "S1", classSectionId: "CS1", status: "active" },
      ];
      RegistrationRepository.findAll.mockResolvedValue(fakeRegistrations);

      const result = await RegistrationService.getListRegistrations();

      expect(RegistrationRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(fakeRegistrations);
    });
  });

  describe("addRegistration", () => {
    it("should add a new registration if valid data is provided", async () => {
      const registrationData = {
        studentId: "S1",
        classSectionId: "CS1",
        status: "active",
      };
      const fakeClassSection = { id: "CS1", currentEnrollment: 10, maxCapacity: 20 };
      const fakeRegistrations = [
        { id: "1", studentId: "S1", classSectionId: "CS1", status: "active" },
      ];

      StudentRepository.findStudentByMssv.mockResolvedValue({ id: "S1" });
      ClassSectionRepository.findOneByCondition.mockResolvedValue(fakeClassSection);
      RegistrationRepository.findOneByCondition.mockResolvedValue(null);
      RegistrationRepository.getNextId.mockResolvedValue("1");
      RegistrationRepository.findAll.mockResolvedValue(fakeRegistrations);

      const result = await RegistrationService.addRegistration(registrationData);

      expect(RegistrationRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ studentId: "S1", classSectionId: "CS1" })
      );
      expect(result).toEqual({
        message: "Thêm đăng ký học thành công",
        registrations: fakeRegistrations,
      });
    });

    it("should throw an error if student does not exist", async () => {
      const registrationData = {
        studentId: "S1",
        classSectionId: "CS1",
        status: "active",
      };

      StudentRepository.findStudentByMssv.mockResolvedValue(null);

      await expect(RegistrationService.addRegistration(registrationData)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: "Sinh viên không tồn tại",
        })
      );
      expect(RegistrationRepository.create).not.toHaveBeenCalled();
    });

    it("should throw an error if class section is full", async () => {
      const registrationData = {
        studentId: "S1",
        classSectionId: "CS1",
        status: "active",
      };
      const fakeClassSection = { id: "CS1", currentEnrollment: 20, maxCapacity: 20 };

      StudentRepository.findStudentByMssv.mockResolvedValue({ id: "S1" });
      ClassSectionRepository.findOneByCondition.mockResolvedValue(fakeClassSection);

      await expect(RegistrationService.addRegistration(registrationData)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: "Lớp học đã đủ sĩ số",
        })
      );
      expect(RegistrationRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("updateRegistration", () => {
    it("should update an existing registration if valid data is provided", async () => {
      const registrationData = {
        id: "1",
        studentId: "S1",
        classSectionId: "CS1",
        status: "active",
      };
      const fakeRegistrations = [
        { id: "1", studentId: "S1", classSectionId: "CS1", status: "active" },
      ];

      RegistrationRepository.update.mockResolvedValue();
      RegistrationRepository.findAll.mockResolvedValue(fakeRegistrations);

      const result = await RegistrationService.updateRegistration(registrationData);

      expect(RegistrationRepository.update).toHaveBeenCalledWith("1", registrationData);
      expect(result).toEqual({
        message: "Cập nhật đăng ký học thành công",
        registrations: fakeRegistrations,
      });
    });

    it("should throw an error if data is invalid", async () => {
      const registrationData = { id: "1", studentId: "", classSectionId: "CS1" }; // Invalid studentId

      await expect(RegistrationService.updateRegistration(registrationData)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: expect.any(Array), // Validation errors
        })
      );
      expect(RegistrationRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteRegistration", () => {
    it("should delete a registration if it exists", async () => {
      const registrationId = "1";
      const fakeRegistrations = [
        { id: "2", studentId: "S2", classSectionId: "CS2", status: "active" },
      ];

      RegistrationRepository.delete.mockResolvedValue();
      RegistrationRepository.findAll.mockResolvedValue(fakeRegistrations);

      const result = await RegistrationService.deleteRegistration(registrationId);

      expect(RegistrationRepository.delete).toHaveBeenCalledWith(registrationId);
      expect(result).toEqual({
        message: "Xóa đăng ký học thành công",
        registrations: fakeRegistrations,
      });
    });

    it("should throw an error if registration ID is not provided", async () => {
      await expect(RegistrationService.deleteRegistration(null)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: "ID đăng ký học không được để trống",
        })
      );
      expect(RegistrationRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("registrationExists", () => {
    it("should return true if registration exists", async () => {
      RegistrationRepository.findOneByCondition.mockResolvedValue({ id: "1" });

      const exists = await RegistrationService.registrationExists("1");

      expect(RegistrationRepository.findOneByCondition).toHaveBeenCalledWith({ id: "1" });
      expect(exists).toBe(true);
    });

    it("should return false if registration does not exist", async () => {
      RegistrationRepository.findOneByCondition.mockResolvedValue(null);

      const exists = await RegistrationService.registrationExists("999");

      expect(RegistrationRepository.findOneByCondition).toHaveBeenCalledWith({ id: "999" });
      expect(exists).toBe(false);
    });
  });

  describe("cancelRegistration", () => {
    it("should cancel a registration if it exists", async () => {
      const registrationId = "1";
      const fakeClassSection = { id: "CS1", currentEnrollment: 10, maxCapacity: 20 };
      const fakeRegistrations = [
        { id: "1", studentId: "S1", classSectionId: "CS1", status: "cancelled" },
      ];

      RegistrationRepository.findOneByCondition.mockResolvedValue({
        id: "1",
        classSectionId: "CS1",
      });
      ClassSectionRepository.findOneByCondition.mockResolvedValue(fakeClassSection);
      RegistrationRepository.findAll.mockResolvedValue(fakeRegistrations);

      const result = await RegistrationService.cancelRegistration(registrationId);

      expect(RegistrationRepository.update).toHaveBeenCalledWith("1", { status: "cancelled" });
      expect(result).toEqual({
        message: "Hủy đăng ký học thành công",
        registrations: fakeRegistrations,
      });
    });

    it("should throw an error if registration does not exist", async () => {
      RegistrationRepository.findOneByCondition.mockResolvedValue(null);

      await expect(RegistrationService.cancelRegistration("1")).rejects.toEqual(
        expect.objectContaining({
          status: 404,
          message: "Đăng ký học không tồn tại",
        })
      );
      expect(RegistrationRepository.update).not.toHaveBeenCalled();
    });
  });
});