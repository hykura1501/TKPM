// Use case: Update a status
const { statusSchema } = require('@validators/statusValidator');
const { addLogEntry } = require('@helpers/logging');
const { SUPPORTED_LOCALES } = require('@configs/locales');

class UpdateStatusUseCase {
  constructor({ statusRepository }) {
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
    await addLogEntry({ message: 'Cập nhật tình trạng sinh viên thành công', level: 'info', action: 'update', entity: 'status', user: 'admin', details: 'Updated status: ' + parsed.data.name });
    return { success: true };
  }
}

module.exports = UpdateStatusUseCase;

