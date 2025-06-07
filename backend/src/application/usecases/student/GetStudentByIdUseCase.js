// Use case: Get student by mssv
class GetStudentByIdUseCase {
  constructor({ studentRepository }) {
    this.studentRepository = studentRepository;
  }

  async execute(mssv) {
    return await this.studentRepository.findStudentByMssv(mssv);
  }
}

module.exports = GetStudentByIdUseCase;
