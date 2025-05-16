const CourseService = require("../../src/api/services/CourseService");
const CourseRepository = require("../../src/api/repositories/CourseRepository");
const ClassSectionRepository = require("../../src/api/repositories/ClassSectionRepository");
const FacultyRepository = require("../../src/api/repositories/FacultyRepository");
const { addLogEntry } = require("../../src/api/helpers/logging");

jest.mock("../../src/api/repositories/CourseRepository");
jest.mock("../../src/api/repositories/ClassSectionRepository");
jest.mock("../../src/api/repositories/FacultyRepository");
jest.mock("../../src/api/helpers/logging");

describe("CourseService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Reset mock calls after each test
  });

  describe("getListCourses", () => {
    it("should return a list of courses", async () => {
      const fakeCourses = [
        {
          id: "1",
          code: "MATH101",
          name: new Map([["vi", "Toán cao cấp"], ["en", "Advanced Math"]]),
          description: new Map([["vi", "Môn toán đại cương"], ["en", "General Math"]]),
          faculty: "F1",
          credits: 3,
        },
      ];
      CourseRepository.findAll.mockResolvedValue(fakeCourses);

      const result = await CourseService.getListCourses("vi");

      expect(CourseRepository.findAll).toHaveBeenCalled();
      expect(result[0].name).toBe("Toán cao cấp");
      expect(result[0].description).toBe("Môn toán đại cương");
    });
  });

  describe("addCourse", () => {
    it("should add a new course if valid data is provided", async () => {
      const courseData = {
        code: "MATH101",
        name: "Toán cao cấp",
        credits: 3,
        faculty: "F1",
        description: "Môn toán đại cương",
        prerequisites: [],
      };

      const newId = "1";
      const fakeCourses = [
        {
          id: "1",
          code: "MATH101",
          name: new Map([["vi", "Toán cao cấp"], ["en", "Advanced Math"]]),
          description: new Map([["vi", "Môn toán đại cương"], ["en", "General Math"]]),
          faculty: "F1",
          credits: 3,
        },
      ];

      FacultyRepository.findOneByCondition.mockResolvedValue({ id: "F1", name: "Faculty of Science" });
      CourseRepository.findOneByCondition.mockResolvedValue(null);
      CourseRepository.getNextId.mockResolvedValue(newId);
      CourseRepository.findAll.mockResolvedValue(fakeCourses);

      const result = await CourseService.addCourse(courseData, "vi");

      expect(CourseRepository.create).toHaveBeenCalled();
      expect(result).toEqual({ success: true, message: "Thêm khóa học thành công", courses: expect.any(Array) });
    });

    it("should throw an error if course code already exists", async () => {
      const courseData = {
        code: "MATH101",
        name: "Toán cao cấp",
        credits: 3,
        faculty: "F1",
        description: "Môn toán đại cương",
        prerequisites: [],
      };

      CourseRepository.findOneByCondition.mockResolvedValue({ id: "1", code: "MATH101" });

      await expect(CourseService.addCourse(courseData, "vi")).rejects.toEqual({
        status: 400,
        message: "Mã khóa học đã tồn tại",
      });
    });

    it("should throw an error if faculty does not exist", async () => {
      const courseData = {
        code: "MATH101",
        name: "Toán cao cấp",
        credits: 3,
        faculty: "F1",
        description: "Môn toán đại cương",
        prerequisites: [],
      };

      CourseRepository.findOneByCondition.mockResolvedValue(null);
      FacultyRepository.findOneByCondition.mockResolvedValue(null);

      await expect(CourseService.addCourse(courseData, "vi")).rejects.toEqual({
        status: 400,
        message: "Khoa phụ trách không tồn tại",
      });
    });
  });

  describe("updateCourse", () => {
    it("should update an existing course if valid data is provided", async () => {
      const courseData = {
        id: "1",
        code: "MATH101",
        name: "Toán cao cấp",
        credits: 3,
        faculty: "F1",
        description: "Môn toán đại cương",
        prerequisites: [],
      };

      // Tạo Map cho name và description
      const nameMap = new Map([["vi", "Cũ"]]);
      const descMap = new Map([["vi", "Cũ"]]);

      const fakeCourses = [
        {
          id: "1",
          code: "MATH101",
          name: nameMap,
          description: descMap,
          faculty: "F1",
          credits: 3,
        },
      ];

      FacultyRepository.findOneByCondition.mockResolvedValue({ id: "F1", name: "Faculty of Science" });
      // Trả về object với name và description là Map (không phải object mới)
      CourseRepository.findOneByCondition.mockResolvedValue({
        id: "1",
        code: "MATH101",
        name: nameMap,
        description: descMap,
        faculty: "F1",
        credits: 3,
      });
      CourseRepository.findAll.mockResolvedValue(fakeCourses);

      const result = await CourseService.updateCourse(courseData, "vi");

      expect(CourseRepository.update).toHaveBeenCalledWith("1", expect.any(Object));
      expect(result).toEqual({ success: true, message: "Cập nhật khóa học thành công", courses: expect.any(Array) });
    });

    it("should throw an error if course does not exist", async () => {
      const courseData = {
        id: "1",
        code: "MATH101",
        name: "Toán cao cấp",
        credits: 3,
        faculty: "F1",
        description: "Môn toán đại cương",
        prerequisites: [],
      };

      CourseRepository.findOneByCondition.mockResolvedValue(null);

      await expect(CourseService.updateCourse(courseData, "vi")).rejects.toEqual({
        status: 404,
        message: "Khóa học không tồn tại",
      });
    });
  });

  describe("deleteCourse", () => {
    it("should delete an existing course", async () => {
      const courseId = "1";
      const fakeCourses = [
        {
          id: "2",
          code: "PHYS101",
          name: new Map([["vi", "Vật lý đại cương"], ["en", "Physics 101"]]),
          description: new Map([["vi", "Môn vật lý đại cương"], ["en", "General Physics"]]),
          faculty: "F2",
          credits: 3,
        },
      ];

      CourseRepository.findOneByCondition.mockResolvedValue({
        id: "1",
        code: "MATH101",
        name: new Map([["vi", "Toán cao cấp"], ["en", "Advanced Math"]]),
        description: new Map([["vi", "Môn toán đại cương"], ["en", "General Math"]]),
        faculty: "F1",
        credits: 3,
      });
      ClassSectionRepository.findOneByCondition.mockResolvedValue(null);
      CourseRepository.findAll.mockResolvedValue(fakeCourses);

      const result = await CourseService.deleteCourse(courseId, "vi");

      expect(CourseRepository.delete).toHaveBeenCalledWith(courseId);
      expect(result).toEqual({ success: true, message: "Xóa khóa học thành công", courses: expect.any(Array) });
    });

    it("should deactivate a course if it is being used", async () => {
      const courseId = "1";
      const fakeCourses = [
        {
          id: "1",
          code: "MATH101",
          name: new Map([["vi", "Toán cao cấp"], ["en", "Advanced Math"]]),
          description: new Map([["vi", "Môn toán đại cương"], ["en", "General Math"]]),
          faculty: "F1",
          credits: 3,
          isActive: false,
        },
      ];

      CourseRepository.findOneByCondition.mockResolvedValue({
        id: "1",
        code: "MATH101",
        name: new Map([["vi", "Toán cao cấp"], ["en", "Advanced Math"]]),
        description: new Map([["vi", "Môn toán đại cương"], ["en", "General Math"]]),
        faculty: "F1",
        credits: 3,
      });
      ClassSectionRepository.findOneByCondition.mockResolvedValue({ id: "CS1", course: "1" });
      CourseRepository.findAll.mockResolvedValue(fakeCourses);

      const result = await CourseService.deleteCourse(courseId, "vi");

      expect(CourseRepository.update).toHaveBeenCalledWith(courseId, { isActive: false });
      expect(result).toEqual({ success: true, message: "Khóa học đã được vô hiệu hóa", courses: expect.any(Array) });
    });

    it("should throw an error if course does not exist", async () => {
      const courseId = "1";

      CourseRepository.findOneByCondition.mockResolvedValue(null);

      await expect(CourseService.deleteCourse(courseId, "vi")).rejects.toEqual({
        status: 404,
        message: "Khóa học không tồn tại",
      });
    });

    it("should throw an error if course ID is not provided", async () => {
      await expect(CourseService.deleteCourse(null, "vi")).rejects.toEqual({
        status: 400,
        message: "ID khóa học không được để trống",
      });
    });
  });
});
