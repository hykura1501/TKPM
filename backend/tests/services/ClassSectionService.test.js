const StudentService = require("../../src/api/services/StudentService");
const StudentRepository = require("../../src/api/repositories/StudentRepository");
const SettingService = require("../../src/api/services/SettingService");
const FacultyService = require("../../src/api/services/FacultyService");
const ProgramService = require("../../src/api/services/ProgramService");
const StatusService = require("../../src/api/services/StatusService");
const { addLogEntry } = require("../../src/api/helpers/logging");

jest.mock("../../src/api/repositories/StudentRepository");
jest.mock("../../src/api/services/SettingService");
jest.mock("../../src/api/services/FacultyService");
jest.mock("../../src/api/services/ProgramService");
jest.mock("../../src/api/services/StatusService", () => ({
  statusExists: jest.fn(),
  findStatusById: jest.fn(),
  findStatusByName: jest.fn(),
  getAllStatuses: jest.fn(),
}));
jest.mock("../../src/api/helpers/logging");

describe("StudentService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mock calls after each test
  });

  describe("getListStudents", () => {
    it("should return a list of students", async () => {
      const fakeStudents = [{ mssv: "123", fullName: "Nguyen Van A" }];
      StudentRepository.getAllStudents.mockResolvedValue(fakeStudents);

      const result = await StudentService.getListStudents();

      expect(StudentRepository.getAllStudents).toHaveBeenCalled();
      expect(result).toEqual(fakeStudents);
    });

    it("should throw an error if fetching students fails", async () => {
      StudentRepository.getAllStudents.mockRejectedValue(new Error("Database error"));

      await expect(StudentService.getListStudents()).rejects.toThrow("Lỗi khi lấy danh sách sinh viên: Database error");
      expect(StudentRepository.getAllStudents).toHaveBeenCalled();
    });
  });

  describe("addStudent", () => {
    it("should add a new student if valid data is provided", async () => {
      const studentData = {
        fullName: "Nguyen Van A",
        dateOfBirth: "2000-01-01",
        gender: "male",
        email: "student@example.com",
        phone: "0123456789",
        faculty: "F1",
        course: "C1",
        program: "P1",
        nationality: "Vietnam",
        status: "S1",
      };

      const settings = {
        allowedEmailDomains: ["example.com"],
        phoneFormats: [{ pattern: "^0[0-9]{9}$" }],
      };

      SettingService.getAllSettings.mockResolvedValue(settings);
      FacultyService.facultyExists.mockResolvedValue(true);
      ProgramService.programExists.mockResolvedValue(true);
      StatusService.statusExists.mockResolvedValue(true);
      StudentRepository.getNextMssv.mockResolvedValue("123");
      StudentRepository.createStudent.mockResolvedValue({ ...studentData, mssv: "123" });

      const result = await StudentService.addStudent(studentData);

      expect(SettingService.getAllSettings).toHaveBeenCalled();
      expect(FacultyService.facultyExists).toHaveBeenCalledWith("F1");
      expect(ProgramService.programExists).toHaveBeenCalledWith("P1");
      expect(StatusService.statusExists).toHaveBeenCalledWith("S1");
      expect(StudentRepository.createStudent).toHaveBeenCalledWith({ ...studentData, mssv: "123" });
      expect(result).toEqual({ ...studentData, mssv: "123" });
    });

    it("should throw an error if email domain is not allowed", async () => {
      const studentData = {
        fullName: "Nguyen Van A",
        dateOfBirth: "2000-01-01",
        gender: "male",
        email: "student@invalid.com",
        phone: "0123456789",
        faculty: "F1",
        course: "C1",
        program: "P1",
        nationality: "Vietnam",
        status: "S1",
      };

      const settings = {
        allowedEmailDomains: ["example.com"],
        phoneFormats: [{ pattern: "^0[0-9]{9}$" }],
      };

      SettingService.getAllSettings.mockResolvedValue(settings);

      await expect(StudentService.addStudent(studentData)).rejects.toThrow(
        "Email phải thuộc một trong các tên miền: example.com"
      );
      expect(SettingService.getAllSettings).toHaveBeenCalled();
      expect(StudentRepository.createStudent).not.toHaveBeenCalled();
    });

    it("should throw an error if faculty does not exist", async () => {
      const studentData = {
        fullName: "Nguyen Van A",
        dateOfBirth: "2000-01-01",
        gender: "male",
        email: "student@example.com",
        phone: "0123456789",
        faculty: "F1",
        course: "C1",
        program: "P1",
        nationality: "Vietnam",
        status: "S1",
      };

      const settings = {
        allowedEmailDomains: ["example.com"],
        phoneFormats: [{ pattern: "^0[0-9]{9}$" }],
      };

      SettingService.getAllSettings.mockResolvedValue(settings);
      FacultyService.facultyExists.mockResolvedValue(false);

      await expect(StudentService.addStudent(studentData)).rejects.toThrow("Khoa không tồn tại");
      expect(FacultyService.facultyExists).toHaveBeenCalledWith("F1");
      expect(StudentRepository.createStudent).not.toHaveBeenCalled();
    });
  });

  describe("updateStudent", () => {
    // it("should update an existing student if valid data is provided", async () => {
    //   const studentData = {
    //     mssv: "123",
    //     fullName: "Nguyen Van B",
    //     dateOfBirth: "2000-01-01",
    //     gender: "male",
    //     email: "student@example.com",
    //     phone: "0123456789",
    //     faculty: "F1",
    //     course: "C1",
    //     program: "P1",
    //     nationality: "Vietnam",
    //     status: "S2",
    //   };
    
    //   const currentStudent = {
    //     mssv: "123",
    //     fullName: "Nguyen Van A",
    //     status: "S1",
    //   };
    
    //   const settings = {
    //     allowedEmailDomains: ["example.com"],
    //     phoneFormats: [{ pattern: "^0[0-9]{9}$" }],
    //   };
    
    //   const statuses = [
    //     { id: "S1", name: "Active" },
    //     { id: "S2", name: "Graduated" },
    //   ];
    
    //   SettingService.getAllSettings.mockResolvedValue(settings);
    //   StudentRepository.findStudentByMssv.mockResolvedValue(currentStudent);
    //   StatusService.findStatusById.mockImplementation((id) => statuses.find((s) => s.id === id)); // Mock đúng cách
    //   StatusService.getAllStatuses.mockResolvedValue(statuses);
    //   StudentRepository.updateStudent.mockResolvedValue(true);
    
    //   await StudentService.updateStudent(studentData);
    
    //   expect(StudentRepository.findStudentByMssv).toHaveBeenCalledWith("123");
    //   expect(StudentRepository.updateStudent).toHaveBeenCalledWith("123", studentData);
    // });

    it("should throw an error if student does not exist", async () => {
      const studentData = {
        mssv: "123",
        fullName: "Nguyen Van B",
        dateOfBirth: "2000-01-01",
        gender: "male",
        email: "student@example.com",
        phone: "0123456789",
        faculty: "F1",
        course: "C1",
        program: "P1",
        nationality: "Vietnam",
        status: "S2",
      };

      StudentRepository.findStudentByMssv.mockResolvedValue(null);

      await expect(StudentService.updateStudent(studentData)).rejects.toThrow("Sinh viên không tồn tại");
      expect(StudentRepository.findStudentByMssv).toHaveBeenCalledWith("123");
      expect(StudentRepository.updateStudent).not.toHaveBeenCalled();
    });
  });

  describe("deleteStudent", () => {
    it("should delete an existing student", async () => {
      const mssv = "123";

      StudentRepository.deleteStudent.mockResolvedValue(true);

      const result = await StudentService.deleteStudent(mssv);

      expect(StudentRepository.deleteStudent).toHaveBeenCalledWith("123");
      expect(result).toBeUndefined(); // No return value expected
    });

    it("should throw an error if mssv is not provided", async () => {
      await expect(StudentService.deleteStudent(null)).rejects.toThrow("MSSV không được để trống");
      expect(StudentRepository.deleteStudent).not.toHaveBeenCalled();
    });
  });
});