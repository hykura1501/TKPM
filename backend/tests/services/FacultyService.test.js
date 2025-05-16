const FacultyService = require("../../src/api/services/FacultyService");
const FacultyRepository = require("../../src/api/repositories/FacultyRepository");
const StudentRepository = require("../../src/api/repositories/StudentRepository");
const { addLogEntry } = require("../../src/api/helpers/logging");

jest.mock("../../src/api/repositories/FacultyRepository");
jest.mock("../../src/api/repositories/StudentRepository", () => ({
  findOneByCondition: jest.fn(),
}));
jest.mock("../../src/api/helpers/logging");

describe('FacultyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getListFaculties', () => {
    it('should return a list of faculties', async () => {
      const fakeFaculties = [
        { id: 'faculty-1', name: new Map([["vi", "Khoa học"], ["en", "Faculty of Science"]]) },
      ];
      FacultyRepository.findAll.mockResolvedValue(fakeFaculties);

      const result = await FacultyService.getListFaculties("vi");

      expect(result).toEqual([
        { id: 'faculty-1', name: "Khoa học" }
      ]);
    });
  });

  describe('addFaculty', () => {
    it('should add a new faculty if valid data is provided', async () => {
      const facultyData = { name: 'Khoa học' };
      const fakeFaculties = [
        { id: 'faculty-123', name: new Map([["vi", "Khoa học"], ["en", "Faculty of Science"]]) },
      ];
      FacultyRepository.create.mockResolvedValue();
      FacultyRepository.findAll.mockResolvedValue(fakeFaculties);

      const result = await FacultyService.addFaculty(facultyData, "vi");

      expect(result).toEqual({
        message: 'Thêm khoa thành công',
        faculties: [
          { id: 'faculty-123', name: "Khoa học" }
        ],
      });
    });

    it('should throw an error if data is invalid', async () => {
      const facultyData = { name: '' }; // Invalid name

      await expect(FacultyService.addFaculty(facultyData, "vi")).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: expect.any(Array),
        })
      );
    });
  });

  describe('updateFaculty', () => {
    it('should update an existing faculty if valid data is provided', async () => {
      const facultyData = { id: '1', name: 'Khoa cập nhật' };
      const fakeFaculties = [
        { id: '1', name: new Map([["vi", "Khoa cập nhật"], ["en", "Updated Faculty"]]) }
      ];

      // Thêm dòng này để mock faculty tồn tại
      FacultyRepository.findOneByCondition.mockResolvedValue({
        id: '1',
        name: new Map([["vi", "Khoa cũ"], ["en", "Old Faculty"]])
      });

      FacultyRepository.update.mockResolvedValue();
      FacultyRepository.findAll.mockResolvedValue(fakeFaculties);

      const result = await FacultyService.updateFaculty(facultyData, "vi");

      expect(result).toEqual({
        message: 'Cập nhật khoa thành công',
        faculties: [
          { id: '1', name: "Khoa cập nhật" }
        ],
      });
    });

    it('should throw an error if data is invalid', async () => {
      const facultyData = { id: '1', name: '' }; // Invalid

      await expect(FacultyService.updateFaculty(facultyData, "vi")).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: expect.any(Array),
        })
      );
    });
  });

  describe('deleteFaculty', () => {
    it('should delete a faculty if it is not being used', async () => {
      const facultyId = '2';
      const fakeFaculties = [
        { id: '2', name: new Map([["vi", "Khoa Nghệ thuật"], ["en", "Faculty of Arts"]]) }
      ];

      StudentRepository.findOneByCondition.mockResolvedValue(null);
      FacultyRepository.delete.mockResolvedValue();
      FacultyRepository.findAll.mockResolvedValue(fakeFaculties);

      const result = await FacultyService.deleteFaculty(facultyId, "vi");

      expect(result).toEqual({
        message: 'Xóa khoa thành công',
        faculties: [
          { id: '2', name: "Khoa Nghệ thuật" }
        ],
      });
    });

    it('should throw an error if faculty is being used', async () => {
      const facultyId = '1';

      StudentRepository.findOneByCondition.mockResolvedValue({
        id: 'student-1',
        facultyId: '1',
      });

      await expect(FacultyService.deleteFaculty(facultyId, "vi")).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: 'Không thể xóa khoa đang được sử dụng',
        })
      );
    });

    it('should throw an error if faculty ID is not provided', async () => {
      await expect(FacultyService.deleteFaculty(undefined, "vi")).rejects.toEqual(
        expect.objectContaining({
          status: 400,
          message: 'ID không được để trống',
        })
      );
    });
  });

  describe('facultyExists', () => {
    it('should return true if faculty exists', async () => {
      FacultyRepository.findOneByCondition.mockResolvedValue({
        id: 'faculty-1',
        name: new Map([["vi", "Khoa học"], ["en", "Faculty of Science"]])
      });

      const exists = await FacultyService.facultyExists('faculty-1');
      expect(exists).toBe(true);
    });

    it('should return false if faculty does not exist', async () => {
      FacultyRepository.findOneByCondition.mockResolvedValue(null);

      const exists = await FacultyService.facultyExists('faculty-999');
      expect(exists).toBe(false);
    });
  });
});
