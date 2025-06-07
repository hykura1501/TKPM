// RegistrationController (Presentation Layer)
class RegistrationController {
  constructor({
    getRegistrationListUseCase,
    getRegistrationByIdUseCase,
    createRegistrationUseCase,
    updateRegistrationUseCase,
    deleteRegistrationUseCase
  }) {
    this.getRegistrationListUseCase = getRegistrationListUseCase;
    this.getRegistrationByIdUseCase = getRegistrationByIdUseCase;
    this.createRegistrationUseCase = createRegistrationUseCase;
    this.updateRegistrationUseCase = updateRegistrationUseCase;
    this.deleteRegistrationUseCase = deleteRegistrationUseCase;
  }
  async getListRegistrations(req, res) {
    try {
      const registrations = await this.getRegistrationListUseCase.execute();
      res.status(200).json(registrations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRegistrationById(req, res) {
    try {
      const registration = await this.getRegistrationByIdUseCase.execute(req.params.id);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }
      res.status(200).json(registration);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createRegistration(req, res) {
    try {
      const newRegistration = await this.createRegistrationUseCase.execute(req.body);
      res.status(201).json(newRegistration);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateRegistration(req, res) {
    try {
      const updated = await this.updateRegistrationUseCase.execute(req.params.id, req.body);
      res.status(200).json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteRegistration(req, res) {
    try {
      const deleted = await this.deleteRegistrationUseCase.execute(req.params.id);
      res.status(200).json(deleted);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = RegistrationController;
