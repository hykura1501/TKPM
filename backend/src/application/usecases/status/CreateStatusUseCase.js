// Use case: Create a new status
const { statusSchema } = require('@validators/statusValidator');
const { addLogEntry } = require('@shared/utils/logging');
const { SUPPORTED_LOCALES } = require('@configs/locales');

class CreateStatusUseCase {
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
    const parsed = statusSchema.safeParse(statusData);
    if (!parsed.success) {
      await addLogEntry({ 
        message: 'Thêm tình trạng sinh viên không hợp lệ', 
        level: 'warn',
        action: 'create',
        entity: 'status',
        user: 'admin',
        details: 'Invalid status data: ' + JSON.stringify(statusData)
      });
      throw { status: 400, message: parsed.error.errors };
    }
    // Sinh id mới
    const newId = await this.statusRepository.getNextId();
    const newStatus = { name: new Map(), id: newId };
    SUPPORTED_LOCALES.forEach((locale) => {
      newStatus.name.set(locale, parsed.data.name);
    });
    newStatus.color = parsed.data.color;
    newStatus.allowedStatus = parsed.data.allowedStatus || [];
    await this.statusRepository.create(newStatus);
    const statuses = (await this.statusRepository.findAll()).map((status) => require('@shared/utils/mapper').formatStatus(status, language));
    await addLogEntry({ message: 'Thêm tình trạng sinh viên thành công', level: 'info', action: 'create', entity: 'status', user: 'admin', details: 'Add new status: ' + parsed.data.name });
    return { message: 'Thêm tình trạng sinh viên thành công', statuses };
  }
}

module.exports = CreateStatusUseCase;

