const StudentService = require("../../src/api/services/StudentService");
const StudentRepository = require("../../src/api/repositories/StudentRepository");
const SettingService = require("../../src/api/services/SettingService");
const FacultyService = require("../../src/api/services/FacultyService");
const ProgramService = require("../../src/api/services/ProgramService");
const StatusService = require("../../src/api/services/StatusService");
const { addLogEntry } = require("../../src/api/helpers/logging");

jest.mock("../../src/api/repositories/StudentRepository");
jest.mock("../../src/api/services/SettingService");
jest.mock("../../src/api/services/FacultyService", () => ({
    findFacultyByName: jest.fn(),
    facultyExists: jest.fn(),
  }));
jest.mock("../../src/api/services/ProgramService", () => ({
    findProgramByName: jest.fn(),
    programExists: jest.fn(),
  }));
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
      const fakeStudents = [{ mssv: "1", fullName: "John Doe" }];
      StudentRepository.getAllStudents.mockResolvedValue(fakeStudents);

      const result = await StudentService.getListStudents();

      expect(StudentRepository.getAllStudents).toHaveBeenCalled();
      expect(result).toEqual(fakeStudents);
    });

    it("should throw an error if fetching students fails", async () => {
      StudentRepository.getAllStudents.mockRejectedValue(new Error("Database error"));

      await expect(StudentService.getListStudents()).rejects.toThrow(
        "Lỗi khi lấy danh sách sinh viên: Database error"
      );
    });
  });

  describe("addStudent", () => {
    it("should add a new student if valid data is provided", async () => {
        const studentData = {
          fullName: "John Doe",
          dateOfBirth: "2000-01-01",
          gender: "male",
          email: "john@example.com",
          phone: "123456789",
          faculty: "faculty-1",
          course: "course-1",
          program: "program-1",
          nationality: "Vietnam",
          status: "status-1",
        };
        const fakeStudent = { ...studentData, mssv: "1" };
      
        SettingService.getAllSettings.mockResolvedValue({
          allowedEmailDomains: ["example.com"],
          phoneFormats: [{ pattern: "^\\d{9}$" }],
        });
        FacultyService.facultyExists.mockResolvedValue(true);
        ProgramService.programExists.mockResolvedValue(true);
        StatusService.statusExists.mockResolvedValue(true);
        StudentRepository.getNextMssv.mockResolvedValue("1");
        StudentRepository.createStudent.mockResolvedValue();
      
        const result = await StudentService.addStudent(studentData);
      
        expect(StudentRepository.createStudent).toHaveBeenCalledWith(fakeStudent);
        expect(result).toEqual(fakeStudent);
      });

    it("should throw an error if data is invalid", async () => {
      const studentData = { fullName: "", email: "invalid-email" };

      SettingService.getAllSettings.mockResolvedValue({
        allowedEmailDomains: ["example.com"],
        phoneFormats: [{ pattern: "^\\d{9}$" }],
      });

      await expect(StudentService.addStudent(studentData)).rejects.toThrow(
        "Lỗi khi thêm sinh viên"
      );
      expect(StudentRepository.createStudent).not.toHaveBeenCalled();
    });
  });

  describe("updateStudent", () => {
    // it("should update a student if valid data is provided", async () => {
    //     const studentData = {
    //       mssv: "1",
    //       fullName: "John Doe Updated",
    //       dateOfBirth: "2000-01-01",
    //       gender: "male",
    //       email: "john@example.com",
    //       phone: "123456789",
    //       faculty: "faculty-1",
    //       course: "course-1",
    //       program: "program-1",
    //       nationality: "Vietnam",
    //       status: "status-2",
    //     };
      
    //     SettingService.getAllSettings.mockResolvedValue({
    //       allowedEmailDomains: ["example.com"],
    //       phoneFormats: [{ pattern: "^\\d{9}$" }],
    //     });
    //     StudentRepository.findStudentByMssv.mockResolvedValue({ mssv: "1", status: "status-1" });
    //     StatusService.findStatusById.mockResolvedValueOnce({ name: "Active" }); // Trạng thái hiện tại
    //     StatusService.findStatusById.mockResolvedValueOnce({ name: "Inactive" }); // Trạng thái mới
    //     StatusService.getAllStatuses.mockResolvedValue([
    //       { name: "Active", allowedStatus: ["Inactive"] }, // Quy tắc chuyển đổi hợp lệ
    //       { name: "Inactive", allowedStatus: [] },
    //     ]);
    //     StudentRepository.updateStudent.mockResolvedValue();
      
    //     await StudentService.updateStudent(studentData);
      
    //     expect(StudentRepository.updateStudent).toHaveBeenCalledWith("1", studentData);
    //   });

    it("should throw an error if student does not exist", async () => {
      const studentData = {
        mssv: "1",
        fullName: "John Doe Updated",
        dateOfBirth: "2000-01-01",
        gender: "male",
        email: "john@example.com",
        phone: "123456789",
        faculty: "faculty-1",
        course: "course-1",
        program: "program-1",
        nationality: "Vietnam",
        status: "status-2",
      };

      StudentRepository.findStudentByMssv.mockResolvedValue(null);

      await expect(StudentService.updateStudent(studentData)).rejects.toThrow(
        "Sinh viên không tồn tại"
      );
      expect(StudentRepository.updateStudent).not.toHaveBeenCalled();
    });
  });

  describe("deleteStudent", () => {
    it("should delete a student if mssv is provided", async () => {
      const mssv = "1";

      StudentRepository.deleteStudent.mockResolvedValue();

      await StudentService.deleteStudent(mssv);

      expect(StudentRepository.deleteStudent).toHaveBeenCalledWith(mssv);
    });

    it("should throw an error if mssv is not provided", async () => {
      await expect(StudentService.deleteStudent(null)).rejects.toThrow(
        "MSSV không được để trống"
      );
      expect(StudentRepository.deleteStudent).not.toHaveBeenCalled();
    });
  });

  describe("addStudentsFromFile", () => {
    it("should add multiple students from file if data is valid", async () => {
        const studentsData = [
          {
            fullName: "John Doe",
            dateOfBirth: "2000-01-01",
            gender: "male",
            email: "john@example.com",
            phone: "123456789",
            faculty: "Faculty A",
            course: "Course A",
            program: "Program A",
            nationality: "Vietnam",
            status: "Active",
          },
        ];
      
        SettingService.getAllSettings.mockResolvedValue({
          allowedEmailDomains: ["example.com"],
          phoneFormats: [{ pattern: "^\\d{9}$" }],
        });
        StatusService.findStatusByName.mockResolvedValue({ id: "status-1" });
        FacultyService.findFacultyByName.mockResolvedValue({ id: "faculty-1" });
        ProgramService.findProgramByName.mockResolvedValue({ id: "program-1" });
        StudentRepository.createManyStudents.mockResolvedValue();
      
        const result = await StudentService.addStudentsFromFile(studentsData);
      
        expect(StudentRepository.createManyStudents).toHaveBeenCalled();
        expect(result).toHaveLength(1);
      });

    it("should throw an error if data is invalid", async () => {
      const studentsData = [{ fullName: "", email: "invalid-email" }];

      await expect(StudentService.addStudentsFromFile(studentsData)).rejects.toThrow(
        "Lỗi khi thêm nhiều sinh viên từ file"
      );
      expect(StudentRepository.createManyStudents).not.toHaveBeenCalled();
    });
  });

  describe("addStudentFromFile", () => {
    it("should add a single student from file if data is valid", async () => {
        const studentData = {
          fullName: "John Doe",
          dateOfBirth: "2000-01-01",
          gender: "male",
          email: "john@example.com",
          phone: "123456789",
          faculty: "Faculty A",
          course: "Course A",
          program: "Program A",
          nationality: "Vietnam",
          status: "Active",
        };
      
        SettingService.getAllSettings.mockResolvedValue({
          allowedEmailDomains: ["example.com"],
          phoneFormats: [{ pattern: "^\\d{9}$" }],
        });
        StatusService.findStatusByName.mockResolvedValue({ id: "status-1" });
        FacultyService.findFacultyByName.mockResolvedValue({ id: "faculty-1" });
        ProgramService.findProgramByName.mockResolvedValue({ id: "program-1" });
        StudentRepository.getNextMssv.mockResolvedValue("1");
        StudentRepository.createStudent.mockResolvedValue();
      
        const result = await StudentService.addStudentFromFile(studentData);
      
        expect(StudentRepository.createStudent).toHaveBeenCalled();
        expect(result).toEqual(expect.objectContaining({ mssv: "1" }));
      });

    it("should throw an error if data is invalid", async () => {
      const studentData = { fullName: "", email: "invalid-email" };

      await expect(StudentService.addStudentFromFile(studentData)).rejects.toThrow(
        "Lỗi khi thêm sinh viên từ file"
      );
      expect(StudentRepository.createStudent).not.toHaveBeenCalled();
    });
  });
});