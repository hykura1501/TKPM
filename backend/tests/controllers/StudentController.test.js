const StudentController = require("../../src/api/controllers/StudentController");
const StudentService = require("../../src/api/services/StudentService");

jest.mock("../../src/api/services/StudentService");

describe("StudentController", () => {
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
    
    describe("getListStudents - success", () => {
        it("should return list successfully", async () => {
            const fakeData = [{ id: 1, name: "Student A" }];
            StudentService.getListStudents.mockResolvedValue(fakeData);
    
            await StudentController.getListStudents(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(fakeData);
        });
    });

    describe("getListStudents - failure", () => {
        it("should handle error", async () => {
            StudentService.getListStudents.mockRejectedValue(new Error("Error fetching"));
    
            await StudentController.getListStudents(req, res);
    
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Lỗi khi lấy danh sách sinh viên" });
        });
    });

    describe("addStudent - success", () => {
        it("should add successfully", async () => {
            const fakeResult = { success: true };
            StudentService.addStudent.mockResolvedValue(fakeResult);
            req.body = { name: "Student B" };
    
            await StudentController.addStudent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: "Thêm sinh viên thành công",
                student: fakeResult,
            });
        });
    });

    describe("addStudent - failure", () => {
        it("should handle error when adding", async () => {
            const error = new Error("Add failed");
            error.status = 400;
            StudentService.addStudent.mockRejectedValue(error);
    
            await StudentController.addStudent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Add failed" });
        });
    });

    describe("updateStudent - success", () => {
        it("should update successfully", async () => {
            const fakeResult = { updated: true };
            StudentService.updateStudent.mockResolvedValue(fakeResult);
            req.body = { id: 1, name: "Updated Student" };
    
            await StudentController.updateStudent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Cập nhật thành công" });
        });
    });

    describe("updateStudent - failure", () => {
        it("should handle error when updating", async () => {
            const error = new Error("Update failed");
            error.status = 400;
            StudentService.updateStudent.mockRejectedValue(error);
    
            await StudentController.updateStudent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Update failed" });
        });
    });

    describe("deleteStudent - success", () => {
        it("should delete successfully", async () => {
            const fakeResult = { deleted: true };
            StudentService.deleteStudent.mockResolvedValue(fakeResult);
            req.params.mssv = "123456";
    
            await StudentController.deleteStudent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: "Xóa thành công" });
        });
    });

    describe("deleteStudent - failure", () => {
        it("should handle error when deleting", async () => {
            const error = new Error("Delete failed");
            error.status = 400;
            StudentService.deleteStudent.mockRejectedValue(error);
    
            await StudentController.deleteStudent(req, res);
    
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: "Delete failed" });
        });
    });
});

