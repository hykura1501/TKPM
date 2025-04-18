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
      const fakeCourses = [{ id: "1", name: "Math 101" }];
      CourseRepository.findAll.mockResolvedValue(fakeCourses);

      const result = await CourseService.getListCourses();

      expect(CourseRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(fakeCourses);
    });
  });

  describe("addCourse", () => {
    it("should add a new course if valid data is provided", async () => {
      const courseData = {
        code: "MATH101",
        name: "Math 101",
        credits: 3,
        faculty: "F1",
        description: "Basic Math Course",
        prerequisites: [],
      };

      const newId = "1";
      const fakeCourses = [{ id: "1", name: "Math 101" }];

      FacultyRepository.findOneByCondition.mockResolvedValue({ id: "F1", name: "Faculty of Science" });
      CourseRepository.findOneByCondition.mockResolvedValue(null);
      CourseRepository.getNextId.mockResolvedValue(newId);
      CourseRepository.findAll.mockResolvedValue(fakeCourses);

      const result = await CourseService.addCourse(courseData);

      expect(CourseRepository.create).toHaveBeenCalledWith({ ...courseData, id: newId });
      expect(result).toEqual({ success: true, message: "Thêm khóa học thành công", courses: fakeCourses });
    });

    it("should throw an error if course code already exists", async () => {
      const courseData = {
        code: "MATH101",
        name: "Math 101",
        credits: 3,
        faculty: "F1",
        description: "Basic Math Course",
        prerequisites: [],
      };

      CourseRepository.findOneByCondition.mockResolvedValue({ id: "1", code: "MATH101" });

      await expect(CourseService.addCourse(courseData)).rejects.toEqual({
        status: 400,
        message: "Mã khóa học đã tồn tại",
      });
    });

    it("should throw an error if faculty does not exist", async () => {
        const courseData = {
          code: "MATH101",
          name: "Math 101",
          credits: 3,
          faculty: "F1",
          description: "Basic Math Course",
          prerequisites: [],
        };
      
        // Mock để đảm bảo mã khóa học và tên khóa học không tồn tại
        CourseRepository.findOneByCondition.mockResolvedValue(null);
      
        // Mock để khoa phụ trách không tồn tại
        FacultyRepository.findOneByCondition.mockResolvedValue(null);
      
        await expect(CourseService.addCourse(courseData)).rejects.toEqual({
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
        name: "Math 101",
        credits: 3,
        faculty: "F1",
        description: "Basic Math Course",
        prerequisites: [],
      };

      const fakeCourses = [{ id: "1", name: "Math 101" }];

      FacultyRepository.findOneByCondition.mockResolvedValue({ id: "F1", name: "Faculty of Science" });
      CourseRepository.findOneByCondition.mockResolvedValue({ id: "1", code: "MATH101" });
      CourseRepository.findAll.mockResolvedValue(fakeCourses);

      const result = await CourseService.updateCourse(courseData);

      expect(CourseRepository.update).toHaveBeenCalledWith("1", courseData);
      expect(result).toEqual({ success: true, message: "Cập nhật khóa học thành công", courses: fakeCourses });
    });

    it("should throw an error if course does not exist", async () => {
      const courseData = {
        id: "1",
        code: "MATH101",
        name: "Math 101",
        credits: 3,
        faculty: "F1",
        description: "Basic Math Course",
        prerequisites: [],
      };

      CourseRepository.findOneByCondition.mockResolvedValue(null);

      await expect(CourseService.updateCourse(courseData)).rejects.toEqual({
        status: 404,
        message: "Khóa học không tồn tại",
      });
    });
  });

  describe("deleteCourse", () => {
    it("should delete an existing course", async () => {
      const courseId = "1";
      const fakeCourses = [{ id: "2", name: "Physics 101" }];

      CourseRepository.findOneByCondition.mockResolvedValue({ id: "1", name: "Math 101" });
      ClassSectionRepository.findOneByCondition.mockResolvedValue(null);
      CourseRepository.findAll.mockResolvedValue(fakeCourses);

      const result = await CourseService.deleteCourse(courseId);

      expect(CourseRepository.delete).toHaveBeenCalledWith(courseId);
      expect(result).toEqual({ success: true, message: "Xóa khóa học thành công", courses: fakeCourses });
    });

    it("should deactivate a course if it is being used", async () => {
      const courseId = "1";
      const fakeCourses = [{ id: "1", name: "Math 101", isActive: false }];

      CourseRepository.findOneByCondition.mockResolvedValue({ id: "1", name: "Math 101" });
      ClassSectionRepository.findOneByCondition.mockResolvedValue({ id: "CS1", course: "1" });
      CourseRepository.findAll.mockResolvedValue(fakeCourses);

      const result = await CourseService.deleteCourse(courseId);

      expect(CourseRepository.update).toHaveBeenCalledWith(courseId, { isActive: false });
      expect(result).toEqual({ success: true, message: "Khóa học đã được vô hiệu hóa", courses: fakeCourses });
    });

    it("should throw an error if course does not exist", async () => {
      const courseId = "1";

      CourseRepository.findOneByCondition.mockResolvedValue(null);

      await expect(CourseService.deleteCourse(courseId)).rejects.toEqual({
        status: 404,
        message: "Khóa học không tồn tại",
      });
    });

    it("should throw an error if course ID is not provided", async () => {
      await expect(CourseService.deleteCourse(null)).rejects.toEqual({
        status: 400,
        message: "ID khóa học không được để trống",
      });
    });
  });
});