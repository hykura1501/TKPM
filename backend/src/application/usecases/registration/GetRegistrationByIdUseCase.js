// Use case: Get registration by id
class GetRegistrationByIdUseCase {
  constructor({ registrationRepository }) {
    this.registrationRepository = registrationRepository;
  }

  async execute(id) {
    return await this.registrationRepository.findOneByCondition({ id });
  }
}

module.exports = GetRegistrationByIdUseCase;
