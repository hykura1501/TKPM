// ClassSectionController (Presentation Layer)
/**
 * @param {{ getClassSectionListUseCase: import('@usecases/classSection/GetClassSectionListUseCase') }} deps
 */
class ClassSectionController {
  /**
   * @param {object} deps
   * @param {import('@usecases/classSection/GetClassSectionListUseCase')} deps.getClassSectionListUseCase
   * @param {import('@usecases/classSection/CreateClassSectionUseCase')} deps.createClassSectionUseCase
   * @param {import('@usecases/classSection/UpdateClassSectionUseCase')} deps.updateClassSectionUseCase
   * @param {import('@usecases/classSection/DeleteClassSectionUseCase')} deps.deleteClassSectionUseCase
   * @param {import('@usecases/classSection/GetClassSectionByCourseIdUseCase')} deps.getClassSectionByCourseIdUseCase
   */
  constructor({ getClassSectionListUseCase, createClassSectionUseCase, updateClassSectionUseCase, deleteClassSectionUseCase, getClassSectionByCourseIdUseCase }) {
    /** @type {import('@usecases/classSection/GetClassSectionListUseCase')} */
    this.getClassSectionListUseCase = getClassSectionListUseCase;
    /** @type {import('@usecases/classSection/CreateClassSectionUseCase')} */
    this.createClassSectionUseCase = createClassSectionUseCase;
    /** @type {import('@usecases/classSection/UpdateClassSectionUseCase')} */
    this.updateClassSectionUseCase = updateClassSectionUseCase;
    /** @type {import('@usecases/classSection/DeleteClassSectionUseCase')} */
    this.deleteClassSectionUseCase = deleteClassSectionUseCase;
    /** @type {import('@usecases/classSection/GetClassSectionByCourseIdUseCase')} */
    this.getClassSectionByCourseIdUseCase = getClassSectionByCourseIdUseCase;
  }

  async getListClassSections(req, res) {
    try {
      const sections = await this.getClassSectionListUseCase.execute();
      res.status(200).json(sections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateClassSection(req, res) {
    try {
      const result = await this.updateClassSectionUseCase.execute(req.body);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật lớp học:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi cập nhật lớp học" });
    }
  }

  async deleteClassSection(req, res) {
    try {
      const result = await this.deleteClassSectionUseCase.execute(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa lớp học:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi xóa lớp học" });
    }
  }
  async createClassSection(req, res) {
    try {
      const result = await this.createClassSectionUseCase.execute(req.body);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi tạo lớp học:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi tạo lớp học" });
    }
  }

  async getClassSectionByCourseId(req, res) {
    try {
      const { courseId } = req.params;
      const result = await this.getClassSectionByCourseIdUseCase.execute(courseId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lớp học theo khóa:", error);
      res.status(error.status || 500).json({ error: error.message || "Lỗi khi lấy danh sách lớp học theo khóa" });
    }
  }

}

module.exports = ClassSectionController;
