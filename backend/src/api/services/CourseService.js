const Course = require('../models/Course'); // Điều chỉnh đường dẫn nếu cần
const Lesson = require('../models/Lesson');
const Teacher = require('../models/Teacher');
const Test = require('../models/Test');
const Student = require('../models/Student');
const Note = require('../models/Note');

class CourseService {
  async getListCourse() {
    try {
      const courses = await Course.find({});
      return courses;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách khóa học');
    }
  }
  // lấy danh sách Course là model ánh xạ vo database. Coures.find() trả về tất cả khoá học. sevice sẽ định nghĩa các hàm làm gì
  async getCourse(slug) {
    try {
      const course = await Course.findOne({ slug })
          .populate('teacher')
          .populate('sections.lessons');
        if (!course) return res.status(404).json({ message: 'Không tìm thấy khóa học' });
        res.json(course);
      if (!course) {
        throw new Error('Khóa học không tồn tại');
      }
      return course;
    } catch (error) {
      throw new Error('Lỗi khi lấy thông tin khóa học');
    }
  }
  async getCourseWithLessons (slug) {
    const course = await Course.findOne({ slug })
      .populate('teacher', 'name email -_id')
      .populate('students', 'name')
      .lean();
  
    if (!course) {
      throw new Error('Không tìm thấy khóa học');
    }
  
    const lessons = await Promise.all(
      course.sections.map(async (section) => {
        return await Promise.all(
          section.lessons.map(async (lesson) => {
            if (lesson.lessonType === 'Lesson') {
              return await Lesson.findById(lesson.lessonId);
            } else if (lesson.lessonType === 'Test') {
              return await Test.findById(lesson.lessonId);
            }
          })
        );
      })
    );

    course.sections = course.sections.map((section, index) => ({
      ...section,
      lessons: lessons[index]
    }));

    return course;
  }
  async getMyCourse(userId) {
    try {
      const courses = await Course.find({ students: userId })
      .select('-teacher -students -price -rating -updatedAt -createdAt -__v')  
      .populate({
          path: 'studentProgress',
          match: { student: userId },
          populate: {
            path: 'lessonsCompleted',
            select: 'title'
          }
        })
        .lean();
  
      // Tính toán tiến độ học tập
      const coursesWithProgress = courses.map(course => {
        const studentProgress = course.studentProgress.find(progress => progress.student.toString() === userId);
        const totalLessons = course.sections.reduce((total, section) => total + section.lessons.length, 0);
        const completedLessons = studentProgress ? studentProgress.lessonsCompleted.length : 0;
        const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  
        return {
          ...course,
          progress
        };
      });
  
      return coursesWithProgress;
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách khóa học');
    }
  }
  async getLession(slug, slugLesson) {
    try {
      const course = await Course.findOne({ slug });
      if (!course) {
        throw new Error('Khóa học không tồn tại');
      }
      const lesson = await Lesson.findOne({ slug: slugLesson, course: course._id });
      // lấy danh sách bài giảng

      if (!lesson) {
        throw new Error('Bài học không tồn tại');
      }
      return lesson;
    }catch (error) {
      throw new Error('Lỗi khi lấy thông tin bài học');
    }
  }
  async getLession(slug, lessionId) {
    try {
      const course = await Course.findOne({ slug });
      if (!course) {
        throw new Error('Khóa học không tồn tại');
      }
      const lesson = await Lesson.findOne({ _id: lessionId, course: course._id });
      // lấy danh sách bài giảng

      if (!lesson) {
        throw new Error('Bài học không tồn tại');
      }
      return lesson;
    }catch (error) {
      throw new Error('Lỗi khi lấy thông tin bài học');
    }
  }
  async getNoteByLessonId(lessonId, userId) {
    try {
      const notes = await Note.find({ lesson: lessonId, student: userId }).lean();
      if (!notes) {
        throw new Error('Không tìm thấy ghi chú');
      }
      return notes;
    } catch (error) {
      throw new Error('Lỗi khi lấy thông tin ghi chú');
    }
  }
  async addNote (lessonId, studentId, content, time) {
    try {
      const newNote = await Note.create({ lesson: lessonId, student: studentId, content, time });
      return newNote;
    } catch (error) {
      throw new Error('Lỗi khi thêm ghi chú');
    }
  }
  
}

module.exports = new CourseService();