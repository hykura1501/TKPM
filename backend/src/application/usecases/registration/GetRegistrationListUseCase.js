// Use case: Get list of registrations
class GetRegistrationListUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IRegistrationRepository')} params.registrationRepository - Repository thao tác đăng ký học
   */
  constructor({ registrationRepository }) {
    /** @type {import('@domain/repositories/IRegistrationRepository')} */
    this.registrationRepository = registrationRepository;
  }

  async execute() {
    return await this.registrationRepository.findAll();
  }
}

module.exports = GetRegistrationListUseCase;
