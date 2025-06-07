// CounterController (Presentation Layer)
const GetCounterListUseCase = require('../../application/usecases/GetCounterListUseCase');
const counterRepository = require('../../infrastructure/repositories/CounterRepository');

const getCounterListUseCase = new GetCounterListUseCase(counterRepository);

class CounterController {
  async getListCounters(req, res) {
    try {
      const counters = await getCounterListUseCase.execute();
      res.status(200).json(counters);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CounterController();
