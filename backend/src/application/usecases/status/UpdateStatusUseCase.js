// Use case: Update a status
const { statusSchema } = require('@validators/statusValidator');
const { SUPPORTED_LOCALES } = require('@configs/locales');
const { addLogEntry } = require('@shared/utils/logging');

class UpdateStatusUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository - Repository thao tác tình trạng sinh viên
   */
  constructor({ statusRepository }) {
    /** @type {import('@domain/repositories/IStatusRepository')} */
    this.statusRepository = statusRepository;
  }

  async execute(id, statusData, language = 'vi') {
    // Validate schema
    const parsed = statusSchema.safeParse({ ...statusData, id });
    if (!parsed.success) {
      await addLogEntry({ message: 'Cập nhật tình trạng sinh viên không hợp lệ', level: 'warn' });
      throw { status: 400, message: parsed.error.errors };
    }
    // Kiểm tra tồn tại status
    const status = await this.statusRepository.findOneByCondition({ id });
    if (!status) {
      await addLogEntry({ message: 'Tình trạng sinh viên không tồn tại', level: 'warn' });
      throw { status: 404, message: 'Tình trạng sinh viên không tồn tại' };
    }
    // Cập nhật tên đa ngôn ngữ
    status.name.set(language, parsed.data.name);
    status.color = parsed.data.color;
    status.allowedStatus = parsed.data.allowedStatus || [];
    await this.statusRepository.update(id, status);
    const statuses = (await this.statusRepository.findAll()).map((status) => require('@shared/utils/mapper').formatStatus(status, language));
    await addLogEntry({ message: 'Cập nhật tình trạng sinh viên thành công', level: 'info', action: 'update', entity: 'status', user: 'admin', details: 'Updated status: ' + parsed.data.name });
    return { message: 'Cập nhật tình trạng sinh viên thành công', statuses };
  }
}

module.exports = UpdateStatusUseCase;

