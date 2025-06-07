// ClassSectionController (Presentation Layer)
// ClassSectionController (Presentation Layer)
/**
 * @param {{ getClassSectionListUseCase: import('@usecases/GetClassSectionListUseCase') }} deps
 */
class ClassSectionController {
  constructor({ getClassSectionListUseCase }) {
    /**
     * @type {import('@usecases/GetClassSectionListUseCase')}
     */
    this.getClassSectionListUseCase = getClassSectionListUseCase;
  }
  async getListClassSections(req, res) {
    try {
      const sections = await this.getClassSectionListUseCase.execute();
      res.status(200).json(sections);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ClassSectionController;
