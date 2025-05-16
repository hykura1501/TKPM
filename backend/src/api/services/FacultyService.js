const FacultyRepository = require("../repositories/FacultyRepository");
const StudentRepository = require("../repositories/StudentRepository");
const { addLogEntry } = require("../helpers/logging");
const { z, map } = require("zod");
const mapper = require("../helpers/Mapper");
const { SUPPORTED_LOCALES } = require("../../configs/locales");

const facultySchema = z.object({
  id: z.string().optional(),
  // name: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
});

class FacultyService {
  async getListFaculties(language = "vi") {
    const faculties = await FacultyRepository.findAll();
    const mappedFaculties = faculties.map((faculty) =>
      mapper.formatFaculty(faculty, language)
    );
    return mappedFaculties;
  }

  async addFaculty(data, language = "vi") {
    const parsed = facultySchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({ message: "Thêm khoa không hợp lệ", level: "warn" });
      throw { status: 400, message: parsed.error.errors };
    }

    const newId = await FacultyRepository.getNextId();

    const newFaculty = { name: new Map(), id: newId };

    SUPPORTED_LOCALES.forEach((locale) => {
      newFaculty.name.set(locale, parsed.data.name);
    })

    await FacultyRepository.create(newFaculty);
    const faculties = (await FacultyRepository.findAll()).map((faculty) =>
      mapper.formatFaculty(faculty, language)
    );
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

  async updateFaculty(data, language = "vi") {
    const parsed = facultySchema.safeParse(data);
    if (!parsed.success) {
      await addLogEntry({
        message: "Cập nhật khoa không hợp lệ",
        level: "warn",
      });
      throw { status: 400, message: parsed.error.errors };
    }
    const faculty = await FacultyRepository.findOneByCondition({
      id: parsed.data.id,
    });

    if (!faculty) {
      await addLogEntry({
        message: "Khoa không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Khoa không tồn tại" };
    }

    faculty.name.set(language, parsed.data.name);

    await FacultyRepository.update(parsed.data.id, {
      name: faculty.name,
    });
    const faculties = (await FacultyRepository.findAll()).map((faculty) =>
      mapper.formatFaculty(faculty, language)
    );
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

  async deleteFaculty(id, language = "vi") {
    if (!id) throw { status: 400, message: "ID không được để trống" };

    const student = await StudentRepository.findOneByCondition({
      facultyId: id,
    });
    if (student) {
      await addLogEntry({
        message: "Không thể xóa khoa đang được sử dụng",
        level: "warn",
      });
      throw { status: 400, message: "Không thể xóa khoa đang được sử dụng" };
    }

    await FacultyRepository.delete(id);
    const faculties = (await FacultyRepository.findAll()).map((faculty) =>
      mapper.formatFaculty(faculty, language)
    );
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

  async getTranslationFacultyById(facultyId) {
    if (!facultyId) {
      await addLogEntry({
        message: "ID khoa không được để trống",
        level: "warn",
      });
      throw { status: 400, message: "ID khoa không được để trống" };
    }

    // Lấy khoa từ cơ sở dữ liệu
    const faculty = await FacultyRepository.findOneByCondition({ id: facultyId });
    if (!faculty) {
      await addLogEntry({
        message: "Khoa không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Khoa không tồn tại" };
    }

    // Định dạng dữ liệu bản dịch
    const translations = {
      en: {
        facultyName: faculty.name.get("en"),
      },
      vi: {
        facultyName: faculty.name.get("vi"),
      },
    };

    return translations;
  }

  async updateTranslationFaculty(facultyId, translations) {
    if (!facultyId) {
      await addLogEntry({
        message: "ID khoa không được để trống",
        level: "warn",
      });
      throw { status: 400, message: "ID khoa không được để trống" };
    }

    // Lấy khoa từ cơ sở dữ liệu
    const faculty = await FacultyRepository.findOneByCondition({ id: facultyId });
    if (!faculty) {
      await addLogEntry({
        message: "Khoa không tồn tại",
        level: "warn",
      });
      throw { status: 404, message: "Khoa không tồn tại" };
    }

    // Cập nhật bản dịch
    SUPPORTED_LOCALES.forEach((locale) => {
      if (translations[locale]) {
        faculty.name.set(locale, translations[locale].facultyName);
      }
    });

    await FacultyRepository.update(facultyId, {
      name: faculty.name,
    });

    return { success: true, message: "Cập nhật bản dịch thành công" };
  }
}

module.exports = new FacultyService();
