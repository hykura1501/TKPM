const mongoose = require('mongoose');

// Import các models
const Teacher = require('../src/api/models/Teacher');
const Student = require('../src/api/models/Student');
const Notification = require('../src/api/models/Notification');
const Subject = require('../src/api/models/Student');
const Course = require('../src/api/models/Course');
const Payment = require('../src/api/models/Payment');
const Lesson = require('../src/api/models/Lesson');
const Note = require('../src/api/models/Note');
const Test = require('../src/api/models/Test');
const Review = require('../src/api/models/Review');
const ForumPost = require('../src/api/models/ForumPost');
const Message = require('../src/api/models/Message');

const seedData = async () => {
  try {

    // Xóa tất cả dữ liệu cũ
    await Teacher.deleteMany({});
    await Student.deleteMany({});
    await Notification.deleteMany({});
    await Subject.deleteMany({});
    await Course.deleteMany({});
    await Payment.deleteMany({});
    await Lesson.deleteMany({});
    await Note.deleteMany({});
    await Test.deleteMany({});
    await Review.deleteMany({});
    await ForumPost.deleteMany({});
    await Message.deleteMany({});

    // Seed dữ liệu giáo viên
    const teachers = await Teacher.create([
      { name: 'Nguyễn Văn A', gender: 'Nam', username: 'teacher1', password: 'password123', email: 'teacher1@example.com', phone: '0123456789' },
      { name: 'Trần Thị B', gender: 'Nữ', username: 'teacher2', password: 'password123', email: 'teacher2@example.com', phone: '0987654321' },
      { name: 'Lê Minh C', gender: 'Nam', username: 'teacher3', password: 'password123', email: 'teacher3@example.com', phone: '0981234567' },
      { name: 'Phạm Thị D', gender: 'Nữ', username: 'teacher4', password: 'password123', email: 'teacher4@example.com', phone: '0976543210' },
      { name: 'Vũ Thiện E', gender: 'Nam', username: 'teacher5', password: 'password123', email: 'teacher5@example.com', phone: '0968765432' },
    ]);

    // Seed dữ liệu học viên
    const students = await Student.create([
      { name: 'Lê Văn C', gender: 'Nam', username: 'student1', password: 'password123', email: 'student1@example.com', phone: '0912345678' },
      { name: 'Phạm Thị D', gender: 'Nữ', username: 'student2', password: 'password123', email: 'student2@example.com', phone: '0909876543' },
      { name: 'Ngô Minh E', gender: 'Nam', username: 'student3', password: 'password123', email: 'student3@example.com', phone: '0923456789' },
      { name: 'Trần Văn F', gender: 'Nam', username: 'student4', password: 'password123', email: 'student4@example.com', phone: '0934567890' },
      { name: 'Nguyễn Thị G', gender: 'Nữ', username: 'student5', password: 'password123', email: 'student5@example.com', phone: '0945678901' },
    ]);

    // Seed dữ liệu môn học
    const subjects = await Subject.create([
      { name: 'Toán học', description: 'Môn học cơ bản và nâng cao về toán học.' },
      { name: 'Vật lý', description: 'Môn học về các nguyên lý vật lý và ứng dụng.' },
      { name: 'Hóa học', description: 'Môn học về các phản ứng hóa học.' },
      { name: 'Sinh học', description: 'Nghiên cứu về thế giới sinh vật.' },
      { name: 'Khoa học máy tính', description: 'Môn học về lập trình và công nghệ thông tin.' },
    ]);

    // Seed dữ liệu khóa học
    const courses = await Course.create([
      { name: 'Đại số tuyến tính', price: 1000000, rating: 4.5, teacher: teachers[0]._id, subjects: [subjects[0]._id] },
      { name: 'Cơ học lượng tử', price: 2000000, rating: 5, teacher: teachers[1]._id, subjects: [subjects[1]._id] },
      { name: 'Nhập môn Hóa học', price: 1500000, rating: 4.0, teacher: teachers[2]._id, subjects: [subjects[2]._id] },
      { name: 'Sinh học cơ bản', price: 1800000, rating: 4.8, teacher: teachers[3]._id, subjects: [subjects[3]._id] },
      { name: 'Lập trình Python', price: 2500000, rating: 5, teacher: teachers[4]._id, subjects: [subjects[4]._id] },
    ]);

    // Seed bài giảng
    const lessons = await Lesson.create([
      {
        name: 'Giới thiệu Đại số tuyến tính',
        description: 'Giới thiệu về các khái niệm cơ bản của đại số tuyến tính.',
        videoUrl: 'https://example.com/video1',
        duration: 3600,
        course: courses[0]._id,
        document: [{ name: 'Tài liệu 1', link: 'https://example.com/document1' }],
      },
      {
        name: 'Giới thiệu Cơ học lượng tử',
        description: 'Các nguyên lý cơ học lượng tử và ứng dụng.',
        videoUrl: 'https://example.com/video2',
        duration: 5400,
        course: courses[1]._id,
        document: [{ name: 'Tài liệu 2', link: 'https://example.com/document2' }],
      },
    ]);

    // Seed bài viết diễn đàn
    const forumPosts = await ForumPost.create([
      {
        title: 'Giới thiệu về Đại số tuyến tính',
        content: 'Bài viết này giới thiệu về các khái niệm cơ bản trong đại số tuyến tính.',
        createdBy: teachers[0]._id,
        course: courses[0]._id,
        comments: [
          { content: 'Bài viết rất dễ hiểu!', user: students[0]._id },
          { content: 'Cần thêm ví dụ cụ thể.', user: students[1]._id },
        ],
      },
      {
        title: 'Giới thiệu về Cơ học lượng tử',
        content: 'Bài viết này giới thiệu về các nguyên lý cơ học lượng tử.',
        createdBy: teachers[1]._id,
        course: courses[1]._id,
        comments: [
          { content: 'Tôi thích bài viết này!', user: students[2]._id },
        ],
      },
    ]);

    // Seed dữ liệu bài kiểm tra (Test) với Submission nhúng
    const tests = await Test.create([
      {
        name: 'Kiểm tra Đại số tuyến tính',
        lesson: lessons[0]._id,
        questions: ['Câu hỏi 1: Phép cộng ma trận', 'Câu hỏi 2: Định lý Gram-Schmidt'],
        submissions: [
          { student: students[0]._id, score: 85, timeSpent: 1200 },
          { student: students[1]._id, score: 90, timeSpent: 1500 },
        ]
      },
      {
        name: 'Kiểm tra Cơ học lượng tử',
        lesson: lessons[1]._id,
        questions: ['Câu hỏi 1: Nguyên lý Heisenberg', 'Câu hỏi 2: Phương trình Schrödinger'],
        submissions: [
          { student: students[2]._id, score: 88, timeSpent: 1400 },
          { student: students[3]._id, score: 92, timeSpent: 1600 },
        ]
      },
    ]);

    // Seed Message
    const messages = await Message.create([
      {
        sender: students[0]._id,
        receiver: students[1]._id,
        content: 'Chào bạn, bạn có thể giúp tôi không?',
      },
      {
        sender: teachers[0]._id,
        receiver: students[2]._id,
        content: 'Hãy xem lại bài học hôm nay nhé!',
      },
    ]);

    // Seed Notification
    const notifications = await Notification.create([
      { content: 'Bạn có một bài kiểm tra mới!' },
      { content: 'Lớp học của bạn đã được cập nhật.' },
    ]);

    console.log('Seed dữ liệu thành công!');
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error);
  } finally {
    mongoose.connection.close();
  }
};

module.exports = seedData;

