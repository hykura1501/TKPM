const SemesterService = require("../../src/api/services/SemesterService");
const SemesterRepository = require("../../src/api/repositories/SemesterRepository");
const StudentRepository = require("../../src/api/repositories/StudentRepository");
const { addLogEntry } = require("../../src/api/helpers/logging");

jest.mock("../../src/api/repositories/SemesterRepository", () => ({
    findAll: jest.fn(),
    getNextId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(), 
    delete: jest.fn(),
    findOneByCondition: jest.fn(),
}));
jest.mock("../../src/api/repositories/StudentRepository", () => ({
  findOneByCondition: jest.fn(),
}));
jest.mock("../../src/api/helpers/logging");

describe("SemesterService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mock calls after each test
  });

  describe("getListSemesters", () => {
    it("should return a list of semesters", async () => {
      const fakeSemesters = [{ id: "1", name: "Spring 2025" }];
      SemesterRepository.findAll.mockResolvedValue(fakeSemesters);

      const result = await SemesterService.getListSemesters();

      expect(SemesterRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(fakeSemesters);
    });
  });

  describe("addSemester", () => {
    it("should add a new semester if valid data is provided", async () => {
      const semesterData = { name: "Spring 2025" };
      const fakeSemesters = [{ id: "1", name: "Spring 2025" }];

      SemesterRepository.getNextId.mockResolvedValue("1");
      SemesterRepository.create.mockResolvedValue();
      SemesterRepository.findAll.mockResolvedValue(fakeSemesters);

      const result = await SemesterService.addSemester(semesterData);

      expect(SemesterRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Spring 2025" })
      );
      expect(result).toEqual({
        message: "Thêm học kỳ thành công",
        semesters: fakeSemesters,
      });
    });

    it("should throw an error if data is invalid", async () => {
      const semesterData = { name: "" }; // Invalid name

      await expect(SemesterService.addSemester(semesterData)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: expect.any(Array), // Validation errors
        })
      );
      expect(SemesterRepository.create).not.toHaveBeenCalled();
    });
  });


  describe("deleteSemester", () => {
    it("should delete a semester if it is not being used", async () => {
      const semesterId = "1";
      const fakeSemesters = [{ id: "2", name: "Fall 2025" }];

      StudentRepository.findOneByCondition.mockResolvedValue(null); // No students using the semester
      SemesterRepository.delete.mockResolvedValue();
      SemesterRepository.findAll.mockResolvedValue(fakeSemesters);

      const result = await SemesterService.deleteSemester(semesterId);

      expect(SemesterRepository.delete).toHaveBeenCalledWith(semesterId);
      expect(result).toEqual({
        message: "Xóa học kỳ thành công",
        semesters: fakeSemesters,
      });
    });

    it("should throw an error if semester is being used", async () => {
      const semesterId = "1";

      StudentRepository.findOneByCondition.mockResolvedValue({ id: "student-1", semester: "1" });

      await expect(SemesterService.deleteSemester(semesterId)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: "Không thể xóa học kỳ đang được sử dụng",
        })
      );
      expect(SemesterRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw an error if semester ID is not provided", async () => {
      await expect(SemesterService.deleteSemester(null)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: "ID học kỳ không được để trống",
        })
      );
      expect(SemesterRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("semesterExists", () => {
    it("should return true if semester exists", async () => {
      SemesterRepository.findOneByCondition.mockResolvedValue({ id: "1", name: "Spring 2025" });

      const exists = await SemesterService.semesterExists("1");

      expect(SemesterRepository.findOneByCondition).toHaveBeenCalledWith({ id: "1" });
      expect(exists).toBe(true);
    });

    it("should return false if semester does not exist", async () => {
      SemesterRepository.findOneByCondition.mockResolvedValue(null);

      const exists = await SemesterService.semesterExists("999");

      expect(SemesterRepository.findOneByCondition).toHaveBeenCalledWith({ id: "999" });
      expect(exists).toBe(false);
    });
  });
});