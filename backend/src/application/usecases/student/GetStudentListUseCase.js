// Use case: Get list of students
class GetStudentListUseCase {
  constructor({ studentRepository }) {
    this.studentRepository = studentRepository;
  }

  async execute() {
    return await this.studentRepository.getAllStudents();
  }
}

module.exports = GetStudentListUseCase;
