const SemesterRepository = require('../repositories/SemesterRepository');
const StudentRepository = require('../repositories/StudentRepository');
const { addLogEntry } = require('../helpers/logging');
const { z } = require('zod');

const semesterSchema = z.object({
  name: z.string().min(1, { message: 'Tên học kỳ không được để trống' }),
});

class SemesterService {
  async getListSemesters() {
    return await SemesterRepository.findAll();
  }

  async addSemester(data) {
    const parsed = semesterSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Thêm học kỳ không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }

    const newId = await SemesterRepository.getNextId();
    const newSemester = { ...parsed.data, id: newId };
    await SemesterRepository.create(newSemester);
    const semesters = await SemesterRepository.findAll();
    await addLogEntry({
      message: "Thêm học kỳ thành công",
      level: "info",
      action: "create",
      entity: "semester",
      user: "admin",
      details: "Add new semester: " + parsed.data.name,
    });
    return { message: "Thêm học kỳ thành công", semesters };
  }

  async updateSemester(data) {
    const parsed = semesterSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Cập nhật học kỳ không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }

    await SemesterRepository.update(parsed.data.id, parsed.data);
    const semesters = await SemesterRepository.findAll();
    await addLogEntry({
      message: "Cập nhật học kỳ thành công",
      level: "info",
      action: "update",
      entity: "semester",
      user: "admin",
      details: "Updated semester: " + parsed.data.name,
    });
    return { message: "Cập nhật học kỳ thành công", semesters };
  }

  async deleteSemester(id) {
    if (!id) {
      await addLogEntry({ message: "ID học kỳ không được để trống", level: "warn" });
      throw { status: 400, message: "ID học kỳ không được để trống" };
    }

    const student = await StudentRepository.findOneByCondition({ semester: id });
    if (student) {
      await addLogEntry({ message: "Không thể xóa học kỳ đang được sử dụng", level: "warn" });
      throw { status: 400, message: "Không thể xóa học kỳ đang được sử dụng" };
    }

    await SemesterRepository.delete(id);
    const semesters = await SemesterRepository.findAll();
    await addLogEntry({
      message: "Xóa học kỳ thành công",
      level: "info",
      action: "delete",
      entity: "semester",
      user: "admin",
      details: `Deleted semester: ${id}`,
    });
    return { message: "Xóa học kỳ thành công", semesters };
  }

  async semesterExists(id) {
    const semester = await SemesterRepository.findOneByCondition({ id });
    return !!semester;
  }
}

module.exports = new SemesterService();