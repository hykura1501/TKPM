const StatusController = require("../../src/api/controllers/StatusController");
const StatusService = require("../../src/api/services/StatusService");

jest.mock("../../src/api/services/StatusService");

describe("StatusController", () => {
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

    describe("getListStatuses - success", () => {
        it("should return list successfully", async () => {
            const fakeData = [{ id: 1, name: "Status A" }];
            StatusService.getListStatuses.mockResolvedValue(fakeData);

            await StatusController.getListStatuses(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeData);
        });
    });

    describe("getListStatuses - failure", () => {
        it("should handle error", async () => {
            StatusService.getListStatuses.mockRejectedValue(new Error("Error fetching"));

            await StatusController.getListStatuses(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Lỗi khi lấy danh sách tình trạng sinh viên" });
        });
    });

    describe("addStatus - success", () => {
        it("should add successfully", async () => {
            const fakeResult = { success: true };
            StatusService.addStatus.mockResolvedValue(fakeResult);
            req.body = { name: "Status B" };

            await StatusController.addStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(fakeResult);
        });
    });

    describe("addStatus - failure", () => {
        it("should handle error when adding", async () => {
            const error = new Error("Add failed");
            error.status = 400;
            StatusService.addStatus.mockRejectedValue(error);

            await StatusController.addStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Add failed" });
        });
    });

    describe("updateStatus - success", () => {  
        it("should update successfully", async () => {
            const fakeResult = { success: true };
            StatusService.updateStatus.mockResolvedValue(fakeResult);
            req.body = { id: 1, name: "Updated Status" };

            await StatusController.updateStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeResult);
        });
    });

    describe("updateStatus - failure", () => {
        it("should handle error when updating", async () => {
            const error = new Error("Update failed");
            error.status = 400;
            StatusService.updateStatus.mockRejectedValue(error);

            await StatusController.updateStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Update failed" });
        });
    });

    describe("deleteStatus - success", () => {
        it("should delete successfully", async () => {
            const fakeResult = { success: true };
            StatusService.deleteStatus.mockResolvedValue(fakeResult);
            req.params.id = 1;

            await StatusController.deleteStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeResult);
        });
    });

    describe("deleteStatus - failure", () => {
        it("should handle error when deleting", async () => {
            const error = new Error("Delete failed");
            error.status = 400;
            StatusService.deleteStatus.mockRejectedValue(error);

            await StatusController.deleteStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Delete failed" });
        });
    });

    describe("updateStatusRules - success", () => {
        it("should update status rules successfully", async () => {
            const fakeResult = { success: true };
            StatusService.updateStatusRules.mockResolvedValue(fakeResult);
            req.body = { statusTransitionsRules: [] };

            await StatusController.updateStatusRules(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeResult);
        });
    });

    describe("updateStatusRules - failure", () => { 
        it("should handle error when updating status rules", async () => {
            const error = new Error("Update rules failed");
            StatusService.updateStatusRules.mockRejectedValue(error);

            await StatusController.updateStatusRules(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Lỗi khi thêm quy tắc cho trạng thái" });
        });
    });  
});