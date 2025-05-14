const FacultyRepository = require('../repositories/FacultyRepository');
const StudentRepository = require('../repositories/StudentRepository');
const { addLogEntry } = require('../helpers/logging');
const { z, map } = require('zod');
const mapper = require('../helpers/Mapper');

const facultySchema = z.object({
  id: z.string().optional(),
  // name: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
});

class FacultyService {
  async getListFaculties(language = "vi") {
    const faculties = await FacultyRepository.findAll();
    const mappedFaculties = faculties.map((faculty) => mapper.formatFaculty(faculty, language));
    return mappedFaculties;
  }

  async addFaculty(data) {
    const parsed = facultySchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Thêm khoa không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }

    const newFaculty = { ...parsed.data, id: `faculty-${Date.now()}` };
    await FacultyRepository.create(newFaculty);
    const faculties = await FacultyRepository.findAll();
    await addLogEntry({
      message: "Thêm khoa thành công",
      level: "info",
      action: "create",
      entity: "faculty",
      user: "admin",
      details: "Add new faculty: " + parsed.data.name,
    });
    return { message: "Thêm khoa thành công", faculties };
  }

  async updateFaculty(data) {
    const parsed = facultySchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Cập nhật khoa không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }

    await FacultyRepository.update(parsed.data.id, parsed.data);
    const faculties = await FacultyRepository.findAll();
    await addLogEntry({
      message: "Cập nhật khoa thành công",
      level: "info",
      action: "update",
      entity: "faculty",
      user: "admin",
      details: "Update faculty: " + parsed.data.name,
    });
    return { message: "Cập nhật khoa thành công", faculties };
  }

  async deleteFaculty(id) {
    if (!id) throw { status: 400, message: "ID không được để trống" };

    const student = await StudentRepository.findOneByCondition({ facultyId: id });
    if (student) {
      await addLogEntry({ message: "Không thể xóa khoa đang được sử dụng", level: "warn" });
      throw { status: 400, message: "Không thể xóa khoa đang được sử dụng" };
    }

    await FacultyRepository.delete(id);
    const faculties = await FacultyRepository.findAll();
    await addLogEntry({
      message: "Xóa khoa thành công",
      level: "info",
      action: "delete",
      entity: "faculty",
      user: "admin",
      details: "Delete faculty: " + id,
    });
    return { message: "Xóa khoa thành công", faculties };
  }
  async facultyExists(id) {
    const faculty = await FacultyRepository.findOneByCondition({ id });
    return !!faculty;
  }
}

module.exports = new FacultyService();