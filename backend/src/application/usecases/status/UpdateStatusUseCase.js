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

  async execute(statusData, language = 'vi') {
    // Validate schema
    const parsed = statusSchema.safeParse({ ...statusData});
    if (!parsed.success) {
      await addLogEntry({ 
        message: 'Cập nhật tình trạng sinh viên không hợp lệ', 
        level: 'warn',
        action: 'update',
        entity: 'status',
        user: 'admin',
        details: 'Invalid status data: ' + JSON.stringify(statusData)
      });
      throw { status: 400, message: parsed.error.errors };
    }
    // Kiểm tra tồn tại status
    const status = await this.statusRepository.findOneByCondition({ id: parsed.data.id });
    if (!status) {
      await addLogEntry({ 
        message: 'Tình trạng sinh viên không tồn tại', 
        level: 'warn',
        action: 'update',
        entity: 'status',
        user: 'admin',
        details: 'Status not found: ' + parsed.data.id
      });
      throw { status: 404, message: 'Tình trạng sinh viên không tồn tại' };
    }
    // Cập nhật tên đa ngôn ngữ
    status.name.set(language, parsed.data.name);
    status.color = parsed.data.color;
    status.allowedStatus = parsed.data.allowedStatus || [];
    await this.statusRepository.update( parsed.data.id, status);
    const statuses = (await this.statusRepository.findAll()).map((status) => require('@shared/utils/mapper').formatStatus(status, language));
    await addLogEntry({ message: 'Cập nhật tình trạng sinh viên thành công', level: 'info', action: 'update', entity: 'status', user: 'admin', details: 'Updated status: ' + parsed.data.name });
    return { message: 'Cập nhật tình trạng sinh viên thành công', statuses };
  }
}

module.exports = UpdateStatusUseCase;

