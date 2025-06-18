const StudentService = require("../services/StudentService");
const Registration = require("../services/RegistrationService");
const ClassSectionService = require("../services/ClassSectionService");
const CourseService = require("../services/CourseService");

class StudentController {
  async getListStudents(req, res) {
    try {
      const students = await StudentService.getListStudents();
      res.status(200).json(students);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sinh viên:", error);
      res.status(500).json({ error: "Lỗi khi lấy danh sách sinh viên" });
    }
  }

  async addStudent(req, res) {
    try {
      const newStudent = await StudentService.addStudent(req.body);
      res.status(201).json({
        message: "Thêm sinh viên thành công",
        student: newStudent,
      });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên:", error);
      const errorMessage = error.message.startsWith("[")
        ? JSON.parse(error.message)
        : { error: error.message };
      res.status(400).json(errorMessage);
    }
  }

  async updateStudent(req, res) {
    try {
      await StudentService.updateStudent(req.body);
      res.status(200).json({ message: "Cập nhật thành công" });
    } catch (error) {
      console.error("Lỗi khi cập nhật sinh viên:", error);
      const errorMessage = error.message.startsWith("[")
        ? JSON.parse(error.message)
        : { error: error.message };
      res.status(400).json(errorMessage);
    }
  }

  async deleteStudent(req, res) {
    try {
      await StudentService.deleteStudent(req.params.mssv);
      res.status(200).json({ message: "Xóa thành công" });
    } catch (error) {
      console.error("Lỗi khi xóa sinh viên:", error);
      res.status(400).json({ error: error.message });
    }
  }

  async addStudentsFromFile(req, res) {
    try {
      const newStudents = await StudentService.addStudentsFromFile(req.body);
      res.status(201).json({
        message: "Thêm sinh viên thành công",
        students: newStudents,
      });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên từ file:", error);
      const errorMessage = error.message.startsWith("[")
        ? JSON.parse(error.message)
        : { error: error.message };
      res.status(400).json(errorMessage);
    }
  }

  async addStudentFromFile(req, res) {
    try {
      const newStudent = await StudentService.addStudentFromFile(req.body);
      res.status(201).json({
        message: "Thêm sinh viên thành công",
        student: newStudent,
      });
    } catch (error) {
      console.error("Lỗi khi thêm sinh viên từ file:", error);
      const errorMessage = error.message.startsWith("[")
        ? JSON.parse(error.message)
        : { error: error.message };
      res.status(400).json(errorMessage);
    }
  }

  async getGradeByStudentId(req, res) {
    try {
      console.log("Student ID:", req.params.studentId); // Log the student ID
      
      const grades = (await Registration.getGradeByStudentId(req.params.studentId)).map((grade) => {
        return grade.toJSON();
      })

      let gpa = 0
      let totalCredits = 0

      for (let i = 0; i < grades.length; i++) { 
        const classInfo = await ClassSectionService.getClassSectionById(grades[i].classSectionId);
        if (classInfo) {
          grades[i].classInfo = classInfo.toJSON();
          const courseInfo = await CourseService.getCourseById(classInfo.courseId, req.language);
          if (courseInfo) {
            grades[i].classInfo.courseInfo = courseInfo;
          }
        } 
        if (grades[i].grade) {
          gpa += grades[i].grade * grades[i].classInfo.courseInfo.credits;
          totalCredits += grades[i].classInfo.courseInfo.credits;
        }
      }

      const studentInfo = await StudentService.getStudentByMssv(req.params.studentId);

      res.status(200).json({
        grades,
        studentInfo,
        gpa: gpa / totalCredits,
        totalCredits,
        totalCourses: grades.length,
      });

    } catch (error) {
      console.error("Lỗi khi lấy điểm của sinh viên:", error);
      res.status(500).json({ error: "Lỗi khi lấy điểm của sinh viên" });
    }
  }
}

module.exports = new StudentController();