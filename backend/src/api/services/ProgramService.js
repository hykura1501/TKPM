const ProgramRepository = require('../repositories/ProgramRepository');
const StudentRepository = require('../repositories/StudentRepository');
const { addLogEntry } = require('../helpers/logging');
const { z } = require('zod');

const programSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Tên chương trình học không được để trống" }),
  faculty: z.string().min(1, { message: "Khoa không được để trống" }), 
});

class ProgramService {
  async getListPrograms() {
    return await ProgramRepository.findAll();
  }

  async addProgram(data) {
    const parsed = programSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Thêm chương trình học không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }

    const newProgram = { ...parsed.data, id: `program-${Date.now()}` };
    await ProgramRepository.create(newProgram);
    const programs = await ProgramRepository.findAll();
    await addLogEntry({
      message: "Thêm chương trình học thành công",
      level: "info",
      action: "create",
      entity: "program",
      user: "admin",
      details: "Add new program: " + parsed.data.name,
    });
    return { message: "Thêm chương trình học thành công", programs };
  }

  async updateProgram(data) {
    const parsed = programSchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Cập nhật chương trình học không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }

    await ProgramRepository.update(parsed.data.id, parsed.data);
    const programs = await ProgramRepository.findAll();
    await addLogEntry({
      message: "Cập nhật chương trình học thành công",
      level: "info",
      action: "update",
      entity: "program",
      user: "admin",
      details: "Updated program: " + parsed.data.name,
    });
    return { message: "Cập nhật chương trình học thành công", programs };
  }

  async deleteProgram(id) {
    if (!id) {
      await addLogEntry({ message: "ID không được để trống", level: "warn" });
      throw { status: 400, message: "ID không được để trống" };
    }

    const students = await StudentRepository.findOneByCondition({ program: id });
    if (students) {
      await addLogEntry({ message: "Không thể xóa chương trình học", level: "warn" });
      throw { status: 400, message: "Không thể xóa chương trình học" };
    }

    await ProgramRepository.delete(id);
    const programs = await ProgramRepository.findAll();
    await addLogEntry({
      message: "Xóa chương trình học thành công",
      level: "info",
      action: "delete",
      entity: "program",
      user: "admin",
      details: "Deleted program: " + id,
    });
    return { message: "Xóa chương trình học thành công", programs };
  }
  async programExists(id) {
    const program = await ProgramRepository.findOneByCondition({ id });
    return !!program;
  }
}

module.exports = new ProgramService();