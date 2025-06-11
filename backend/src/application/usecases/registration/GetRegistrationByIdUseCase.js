// Use case: Get registration by id
class GetRegistrationByIdUseCase {
  /**
   * @param {object} params
   * @param {import('@domain/repositories/IRegistrationRepository')} params.registrationRepository - Repository thao tác đăng ký học
   */
  constructor({ registrationRepository }) {
    /** @type {import('@domain/repositories/IRegistrationRepository')} */
    this.registrationRepository = registrationRepository;
  }

  async execute(id) {
    return await this.registrationRepository.findOneByCondition({ id });
  }
}

module.exports = GetRegistrationByIdUseCase;
