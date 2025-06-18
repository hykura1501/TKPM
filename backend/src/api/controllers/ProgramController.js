const ProgramService = require("../services/ProgramService");

class ProgramController {
  async getListPrograms(req, res) {
    try {
      const programs = await ProgramService.getListPrograms(req.language);
      res.status(200).json(programs);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chương trình học:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách chương trình học" });
    }
  }

  async addProgram(req, res) {
    try {
      const result = await ProgramService.addProgram(req.body, req.language);
      res.status(201).json(result);
    } catch (error) {
      console.error("Lỗi khi thêm chương trình học:", error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "Lỗi khi thêm chương trình học" });
    }
  }

  async updateProgram(req, res) {
    try {
      const result = await ProgramService.updateProgram(req.body, req.language);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi cập nhật chương trình học:", error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "Lỗi khi cập nhật chương trình học" });
    }
  }

  async deleteProgram(req, res) {
    try {
      const result = await ProgramService.deleteProgram(req.params.id, req.language);
      res.status(200).json(result);
    } catch (error) {
      console.error("Lỗi khi xóa chương trình học:", error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "Lỗi khi xóa chương trình học" });
    }
  }

  async getTranslationProgram(req, res) {
    try {
      const result = await ProgramService.getTranslationProgramById(
        req.params.id
      );
      res.status(200).json(result);
    }
    catch (error) {
      console.error("Lỗi khi lấy bản dịch chương trình học:", error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "Lỗi khi lấy bản dịch chương trình học" });
    }
  }

  async updateTranslationProgram(req, res) {
    try {
      const result = await ProgramService.updateTranslationProgram(
        req.params.id,
        req.body
      );
      res.status(200).json(result);
    }
    catch (error) {
      console.error("Lỗi khi cập nhật bản dịch chương trình học:", error);
      res
        .status(error.status || 500)
        .json({ error: error.message || "Lỗi khi cập nhật bản dịch chương trình học" });
    }
  }
}

module.exports = new ProgramController();
