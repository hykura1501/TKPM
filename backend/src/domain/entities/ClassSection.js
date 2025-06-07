// Domain Entity - ClassSection
class ClassSection {
  constructor({
    id,
    code,
    courseId,
    academicYear,
    semester,
    instructor,
    maxCapacity,
    currentEnrollment,
    schedule,
    classroom,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.code = code;
    this.courseId = courseId;
    this.academicYear = academicYear;
    this.semester = semester;
    this.instructor = instructor;
    this.maxCapacity = maxCapacity;
    this.currentEnrollment = currentEnrollment;
    this.schedule = schedule;
    this.classroom = classroom;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
module.exports = ClassSection;
