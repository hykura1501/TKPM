const ProgramService = require("../../src/api/services/ProgramService");
const ProgramRepository = require("../../src/api/repositories/ProgramRepository");
const StudentRepository = require("../../src/api/repositories/StudentRepository");
const { addLogEntry } = require("../../src/api/helpers/logging");

jest.mock("../../src/api/repositories/ProgramRepository");
jest.mock("../../src/api/repositories/StudentRepository", () => ({
  findOneByCondition: jest.fn(),
}));
jest.mock("../../src/api/helpers/logging");

describe("ProgramService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mock calls after each test
  });

  describe("getListPrograms", () => {
    it("should return a list of programs", async () => {
      const fakePrograms = [{ id: "1", name: "Computer Science", faculty: "F1" }];
      ProgramRepository.findAll.mockResolvedValue(fakePrograms);

      const result = await ProgramService.getListPrograms();

      expect(ProgramRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(fakePrograms);
    });
  });

  describe("addProgram", () => {
    it("should add a new program if valid data is provided", async () => {
      const programData = { name: "Computer Science", faculty: "F1" };
      const fakePrograms = [{ id: "program-1", name: "Computer Science", faculty: "F1" }];

      ProgramRepository.create.mockResolvedValue();
      ProgramRepository.findAll.mockResolvedValue(fakePrograms);

      const result = await ProgramService.addProgram(programData);

      expect(ProgramRepository.create).toHaveBeenCalledWith(expect.objectContaining({ name: "Computer Science" }));
      expect(result).toEqual({
        message: "Thêm chương trình học thành công",
        programs: fakePrograms,
      });
    });

    it("should throw an error if data is invalid", async () => {
      const programData = { name: "", faculty: "F1" }; // Invalid name

      await expect(ProgramService.addProgram(programData)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: expect.any(Array), // Validation errors
        })
      );
      expect(ProgramRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("updateProgram", () => {
    it("should update an existing program if valid data is provided", async () => {
      const programData = { id: "1", name: "Updated Program", faculty: "F1" };
      const fakePrograms = [{ id: "1", name: "Updated Program", faculty: "F1" }];

      ProgramRepository.update.mockResolvedValue();
      ProgramRepository.findAll.mockResolvedValue(fakePrograms);

      const result = await ProgramService.updateProgram(programData);

      expect(ProgramRepository.update).toHaveBeenCalledWith("1", programData);
      expect(result).toEqual({
        message: "Cập nhật chương trình học thành công",
        programs: fakePrograms,
      });
    });

    it("should throw an error if data is invalid", async () => {
      const programData = { id: "1", name: "", faculty: "F1" }; // Invalid name

      await expect(ProgramService.updateProgram(programData)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: expect.any(Array), // Validation errors
        })
      );
      expect(ProgramRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteProgram", () => {
    it("should delete a program if it is not being used", async () => {
      const programId = "1";
      const fakePrograms = [{ id: "2", name: "Mathematics", faculty: "F2" }];

      StudentRepository.findOneByCondition.mockResolvedValue(null); // No students using the program
      ProgramRepository.delete.mockResolvedValue();
      ProgramRepository.findAll.mockResolvedValue(fakePrograms);

      const result = await ProgramService.deleteProgram(programId);

      expect(ProgramRepository.delete).toHaveBeenCalledWith(programId);
      expect(result).toEqual({
        message: "Xóa chương trình học thành công",
        programs: fakePrograms,
      });
    });

    it("should throw an error if program is being used", async () => {
      const programId = "1";

      StudentRepository.findOneByCondition.mockResolvedValue({ id: "student-1", program: "1" });

      await expect(ProgramService.deleteProgram(programId)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: "Không thể xóa chương trình học",
        })
      );
      expect(ProgramRepository.delete).not.toHaveBeenCalled();
    });

    it("should throw an error if program ID is not provided", async () => {
      await expect(ProgramService.deleteProgram(null)).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: "ID không được để trống",
        })
      );
      expect(ProgramRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("programExists", () => {
    it("should return true if program exists", async () => {
      ProgramRepository.findOneByCondition.mockResolvedValue({ id: "1", name: "Computer Science" });

      const exists = await ProgramService.programExists("1");

      expect(ProgramRepository.findOneByCondition).toHaveBeenCalledWith({ id: "1" });
      expect(exists).toBe(true);
    });

    it("should return false if program does not exist", async () => {
      ProgramRepository.findOneByCondition.mockResolvedValue(null);

      const exists = await ProgramService.programExists("999");

      expect(ProgramRepository.findOneByCondition).toHaveBeenCalledWith({ id: "999" });
      expect(exists).toBe(false);
    });
  });
});