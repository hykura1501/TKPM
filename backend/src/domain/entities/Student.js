// Domain Entity - Student (no mongoose, pure JS object)
class Student {
  constructor({
    mssv,
    fullName,
    dateOfBirth,
    gender,
    faculty,
    course,
    program,
    permanentAddress,
    mailingAddress,
    identityDocument,
    nationality,
    email,
    phone,
    status,
    createdAt,
    updatedAt
  }) {
    this.mssv = mssv;
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
    this.gender = gender;
    this.faculty = faculty;
    this.course = course;
    this.program = program;
    this.permanentAddress = permanentAddress;
    this.mailingAddress = mailingAddress;
    this.identityDocument = identityDocument;
    this.nationality = nationality;
    this.email = email;
    this.phone = phone;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Student;
