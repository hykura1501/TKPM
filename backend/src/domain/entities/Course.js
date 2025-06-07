// Domain Entity - Course (no mongoose, pure JS object)
class Course {
  constructor({
    id,
    code,
    name,
    credits,
    faculty,
    description,
    prerequisites,
    isActive,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.faculty = faculty;
    this.description = description;
    this.prerequisites = prerequisites;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Course;
