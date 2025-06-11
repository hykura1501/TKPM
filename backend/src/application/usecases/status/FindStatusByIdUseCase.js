// Use case: Find status by id
const { addLogEntry } = require('@shared/utils/logging');

class FindStatusByIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository
   */
  constructor({ statusRepository }) {
    this.statusRepository = statusRepository;
  }

  async execute(id) {
    const status = await this.statusRepository.findOneByCondition({ id });
    if (!status) {
      await addLogEntry({ message: "Tình trạng sinh viên không tồn tại", level: "warn" });
      throw { status: 404, message: "Tình trạng sinh viên không tồn tại" };
    }
    return status;
  }
}

module.exports = FindStatusByIdUseCase;
