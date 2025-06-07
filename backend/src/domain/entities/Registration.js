// Domain Entity - Registration
class Registration {
  constructor({
    id,
    studentId,
    classSectionId,
    status,
    grade,
    registeredAt,
    cancelledAt,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.studentId = studentId;
    this.classSectionId = classSectionId;
    this.status = status;
    this.grade = grade;
    this.registeredAt = registeredAt;
    this.cancelledAt = cancelledAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
module.exports = Registration;
