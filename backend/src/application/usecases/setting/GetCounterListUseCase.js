// Use case: Get list of counters
class GetCounterListUseCase {
  constructor(counterRepository) {
    this.counterRepository = counterRepository;
  }

  async execute() {
    // Giả sử muốn lấy tất cả counter, nếu cần có thể sửa lại cho phù hợp
    return await this.counterRepository.findAll ? this.counterRepository.findAll() : [];
  }
}

module.exports = GetCounterListUseCase;
