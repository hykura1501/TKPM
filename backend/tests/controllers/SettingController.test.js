const SettingController = require('../../controllers/SettingController');
const SettingService = require('../../services/SettingService');

jest.mock('../../services/SettingService');

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
    
    describe('getListSettings - success', () => {
        it('should return list successfully', async () => {
        const fakeData = [{ id: 1, name: 'Setting A' }];
        SettingService.getListSettings.mockResolvedValue(fakeData);
    
        await SettingController.getListSettings(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeData);
        });
    });

    describe('getListSettings - failure', () => {
        it('should handle error', async () => {
        SettingService.getListSettings.mockRejectedValue(new Error('Error fetching'));
    
        await SettingController.getListSettings(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Lỗi khi lấy danh sách cài đặt' });
        });
    });

    describe('addSetting - success', () => {
        it('should add successfully', async () => {
        const fakeResult = { success: true };
        SettingService.addSetting.mockResolvedValue(fakeResult);
        req.body = { name: 'Setting B' };
    
        await SettingController.addSetting(req, res);
    
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(fakeResult);
        });
    }); 

    describe('addSetting - failure', () => {
        it('should handle error when adding', async () => {
        const error = new Error('Add failed');
        error.status = 400;
        SettingService.addSetting.mockRejectedValue(error);
    
        await SettingController.addSetting(req, res);
    
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Add failed' });
        });
    }); 

    describe('updateSetting - success', () => {
        it('should update successfully', async () => {
            const fakeResult = { success: true };
            SettingService.updateSetting.mockResolvedValue(fakeResult);
            req.params.id = 1;
            req.body = { name: 'Updated Setting' };
    
            await SettingController.updateSetting(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeResult);
        });
    }); 

    describe('updateSetting - failure', () => {
        it('should handle error when updating', async () => {
            const error = new Error('Update failed');
            error.status = 400;
            SettingService.updateSetting.mockRejectedValue(error);
    
            await SettingController.updateSetting(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Update failed' });
        });
    }); 

    describe('deleteSetting - success', () => {
        it('should delete successfully', async () => {
            SettingService.deleteSetting.mockResolvedValue({ success: true });
            req.params.id = 1;
    
            await SettingController.deleteSetting(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Xóa thành công' });
        });
    }); 

    describe('deleteSetting - failure', () => {
        it('should handle error when deleting', async () => {
            const error = new Error('Delete failed');
            error.status = 400;
            SettingService.deleteSetting.mockRejectedValue(error);
    
            await SettingController.deleteSetting(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Delete failed' });
        });
    }); 
});