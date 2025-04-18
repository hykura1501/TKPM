// tests/controllers/ClassSectionController.test.js
const ClassSectionController = require('../../src/api/controllers/ClassSectionController');
const ClassSectionService = require('../../src/api/services/ClassSectionService');

jest.mock('../../src/api/services/ClassSectionService');

describe('ClassSectionController', () => {
  const setup = () => {
    const req = { body: {}, params: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    return { req, res };
  };

  afterEach(() => jest.clearAllMocks());

  it('getListClassSections - success', async () => {
    const { req, res } = setup();
    const fakeData = [{ id: 1 }];
    ClassSectionService.getListClassSections.mockResolvedValue(fakeData);

    await ClassSectionController.getListClassSections(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeData);
  });

  it('getListClassSections - failure', async () => {
    const { req, res } = setup();
    ClassSectionService.getListClassSections.mockRejectedValue(new Error('Error fetching'));

    await ClassSectionController.getListClassSections(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Lỗi khi lấy danh sách khoa' });
  });

  it('addClassSection - success', async () => {
    const { req, res } = setup();
    const fakeResult = { success: true };
    ClassSectionService.addClassSection.mockResolvedValue(fakeResult);

    await ClassSectionController.addClassSection(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(fakeResult);
  });

  it('addClassSection - failure', async () => {
    const { req, res } = setup();
    const error = new Error('Add failed');
    error.status = 400;
    ClassSectionService.addClassSection.mockRejectedValue(error);

    await ClassSectionController.addClassSection(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Add failed' });
  });

  it('updateClassSection - success', async () => {
    const { req, res } = setup();
    const fakeResult = { updated: true };
    ClassSectionService.updateClassSection.mockResolvedValue(fakeResult);

    await ClassSectionController.updateClassSection(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeResult);
  });

  it('updateClassSection - failure', async () => {
    const { req, res } = setup();
    const error = new Error('Update failed');
    error.status = 404;
    ClassSectionService.updateClassSection.mockRejectedValue(error);

    await ClassSectionController.updateClassSection(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
  });

  it('deleteClassSection - success', async () => {
    const { req, res } = setup();
    const fakeResult = { deleted: true };
    ClassSectionService.deleteClassSection.mockResolvedValue(fakeResult);
    req.params.id = '1';

    await ClassSectionController.deleteClassSection(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(fakeResult);
  });

  it('deleteClassSection - failure', async () => {
    const { req, res } = setup();
    const error = new Error('Delete failed');
    error.status = 400;
    ClassSectionService.deleteClassSection.mockRejectedValue(error);
    req.params.id = '1';

    await ClassSectionController.deleteClassSection(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Delete failed' });
  });
});