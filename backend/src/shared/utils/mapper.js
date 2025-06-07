class Mapper{
  formatCourse(course, language = "en") {
    if (!course) return null;

    return {
      id: course.id,
      code: course.code,
      name: course.name.get(language) || course.name.get("en"),
      description: course.description?.get(language) || course.description?.get("en"),
      faculty: course.faculty,
      credits: course.credits,
      prerequisites: course.prerequisites,
      isActive: course.isActive,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
  formatFaculty(faculty, language = "en") {
    if (!faculty) return null;

    return {
      id: faculty.id,
      name: faculty.name.get(language) || faculty.name.get("en"),
    };
  }
  formatProgram(program, language = "en") {
    if (!program) return null;

    return {
      id: program.id,
      name: program.name.get(language) || program.name.get("en"),
      faculty: program.faculty,
    };
  }
  formatStatus(status, language = "en") {

    if (!status) return null;

    return {
      id: status.id,
      name: status.name.get(language) || status.name.get("en"),
      color: status.color,
      allowedStatus: status.allowedStatus,
    };
  }

}
module.exports = new Mapper();