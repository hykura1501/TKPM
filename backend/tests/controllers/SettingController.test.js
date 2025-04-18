const SettingController = require("../../src/api/controllers/SettingController");
const SettingService = require("../../src/api/services/SettingService");

jest.mock("../../src/api/services/SettingService");

describe('SettingController', () => {
    let req, res;
    
    beforeEach(() => {
        req = { body: {}, params: {} };
        res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        };
    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });
    
    describe('updateDomain - success', () => {
        it('should update domain successfully', async () => {
            const fakeResult = { success: true };
            SettingService.updateDomains.mockResolvedValue(fakeResult);
            req.body = { domain: 'example.com' };

            await SettingController.updateDomains(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeResult);
        });
    });

    describe('updateDomain - failure', () => {
        it('should handle error when updating domain', async () => {
            const error = new Error('Update failed');
            error.status = 400;
            SettingService.updateDomains.mockRejectedValue(error);

            await SettingController.updateDomains(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
        });
    });

    describe('getDomains - success', () => {
        it('should get domains successfully', async () => {
            const fakeData = { domain: 'example.com' };
            SettingService.getDomains.mockResolvedValue(fakeData);

            await SettingController.getDomains(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeData);
        });
    }); 

    describe('getDomains - failure', () => {
        it('should handle error when getting domains', async () => {
            SettingService.getDomains.mockRejectedValue(new Error('Error fetching'));

            await SettingController.getDomains(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Lỗi khi lấy danh sách domain' });
        });
    }); 

    describe('updatePhoneFormats - success', () => {
        it('should update phone formats successfully', async () => {
            const fakeResult = { success: true };
            SettingService.updatePhoneFormats.mockResolvedValue(fakeResult);
            req.body = { phoneFormats: ['+84', '0'] };

            await SettingController.updatePhoneFormats(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeResult);
        });
    }); 

    describe('updatePhoneFormats - failure', () => {
        it('should handle error when updating phone formats', async () => {
            const error = new Error('Update failed');
            error.status = 400;
            SettingService.updatePhoneFormats.mockRejectedValue(error);

            await SettingController.updatePhoneFormats(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
        });
    }); 

    describe('getAllSettings - success', () => {
        it('should get all settings successfully', async () => {
            const fakeData = { setting1: 'value1', setting2: 'value2' };
            SettingService.getAllSettings.mockResolvedValue(fakeData);

            await SettingController.getAllSettings(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeData);
        });
    }); 

    describe('getAllSettings - failure', () => {
        it('should handle error when getting all settings', async () => {
            SettingService.getAllSettings.mockRejectedValue(new Error('Error fetching'));

            await SettingController.getAllSettings(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Lỗi khi lấy danh sách setting' });
        });
    }); 

    describe('getStatusRules - success', () => {
        it('should get status rules successfully', async () => {
            const fakeData = { rule1: 'value1', rule2: 'value2' };
            SettingService.getStatusRules.mockResolvedValue(fakeData);

            await SettingController.getStatusRules(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeData);
        });
    }); 

    describe('getStatusRules - failure', () => {
        it('should handle error when getting status rules', async () => {
            SettingService.getStatusRules.mockRejectedValue(new Error('Error fetching'));

            await SettingController.getStatusRules(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: 'Lỗi khi lấy danh sách setting' });
        });
    }); 
});