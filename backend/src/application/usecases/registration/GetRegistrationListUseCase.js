// Use case: Get list of registrations
class GetRegistrationListUseCase {
  constructor({ registrationRepository }) {
    this.registrationRepository = registrationRepository;
  }

  async execute() {
    return await this.registrationRepository.findAll();
  }
}

module.exports = GetRegistrationListUseCase;
