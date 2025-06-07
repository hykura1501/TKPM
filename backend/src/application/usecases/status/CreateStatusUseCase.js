// Use case: Create a new status
const { statusSchema } = require('@validators/statusValidator');
const { addLogEntry } = require('@helpers/logging');
const { SUPPORTED_LOCALES } = require('@configs/locales');

class CreateStatusUseCase {
  constructor({ statusRepository }) {
    this.statusRepository = statusRepository;
  }

  async execute(statusData) {
    // Validate schema
    const parsed = statusSchema.safeParse(statusData);
    if (!parsed.success) {
      await addLogEntry({ message: 'Thêm tình trạng sinh viên không hợp lệ', level: 'warn' });
      throw { status: 400, message: parsed.error.errors };
    }
    // Sinh id mới
    const newId = Date.now().toString();
    const newStatus = { name: new Map(), id: newId };
    SUPPORTED_LOCALES.forEach((locale) => {
      newStatus.name.set(locale, parsed.data.name);
    });
    newStatus.color = parsed.data.color;
    newStatus.allowedStatus = parsed.data.allowedStatus || [];
    await this.statusRepository.create(newStatus);
    await addLogEntry({ message: 'Thêm tình trạng sinh viên thành công', level: 'info', action: 'create', entity: 'status', user: 'admin', details: 'Add new status: ' + parsed.data.name });
    return { success: true, status: newStatus };
  }
}

module.exports = CreateStatusUseCase;

