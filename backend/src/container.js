// Dependency Injection Container using awilix
const { createContainer, asClass } = require('awilix');

// Repositories
const StudentRepository = require('./infrastructure/repositories/StudentRepository');
const FacultyRepository = require('./infrastructure/repositories/FacultyRepository');
const ProgramRepository = require('./infrastructure/repositories/ProgramRepository');
const StatusRepository = require('./infrastructure/repositories/StatusRepository');
const LogRepository = require('./infrastructure/repositories/LogRepository');
const SettingRepository = require('./infrastructure/repositories/SettingRepository');
const ClassSectionRepository = require('./infrastructure/repositories/ClassSectionRepository');
const RegistrationRepository = require('./infrastructure/repositories/RegistrationRepository');
const SemesterRepository = require('./infrastructure/repositories/SemesterRepository');
const CourseRepository = require('./infrastructure/repositories/CourseRepository');
// ... import các repository khác nếu cần

// Usecases
const GetStudentListUseCase = require('./application/usecases/student/GetStudentListUseCase');
const GetStudentByIdUseCase = require('./application/usecases/student/GetStudentByIdUseCase');
const CreateStudentUseCase = require('./application/usecases/student/CreateStudentUseCase');
const UpdateStudentUseCase = require('./application/usecases/student/UpdateStudentUseCase');
const DeleteStudentUseCase = require('./application/usecases/student/DeleteStudentUseCase');
const GetFacultyListUseCase = require('./application/usecases/faculty/GetFacultyListUseCase');
const GetFacultyByIdUseCase = require('./application/usecases/faculty/GetFacultyByIdUseCase');
const CreateFacultyUseCase = require('./application/usecases/faculty/CreateFacultyUseCase');
const UpdateFacultyUseCase = require('./application/usecases/faculty/UpdateFacultyUseCase');
const DeleteFacultyUseCase = require('./application/usecases/faculty/DeleteFacultyUseCase');
const GetTranslationFacultyUseCase = require('./application/usecases/faculty/GetTranslationFacultyUseCase');
const UpdateTranslationFacultyUseCase = require('./application/usecases/faculty/UpdateTranslationFacultyUseCase');
const GetProgramListUseCase = require('./application/usecases/program/GetProgramListUseCase');
const GetProgramByIdUseCase = require('./application/usecases/program/GetProgramByIdUseCase');
const CreateProgramUseCase = require('./application/usecases/program/CreateProgramUseCase');
const UpdateProgramUseCase = require('./application/usecases/program/UpdateProgramUseCase');
const DeleteProgramUseCase = require('./application/usecases/program/DeleteProgramUseCase');

const GetStatusListUseCase = require('./application/usecases/status/GetStatusListUseCase');
const CreateStatusUseCase = require('./application/usecases/status/CreateStatusUseCase');
const UpdateStatusUseCase = require('./application/usecases/status/UpdateStatusUseCase');
const DeleteStatusUseCase = require('./application/usecases/status/DeleteStatusUseCase');

const GetLogListUseCase = require('./application/usecases/log/GetLogListUseCase');

const GetSettingListUseCase = require('./application/usecases/setting/GetSettingListUseCase');
const CreateSettingUseCase = require('./application/usecases/setting/CreateSettingUseCase');
const UpdateSettingUseCase = require('./application/usecases/setting/UpdateSettingUseCase');
const DeleteSettingUseCase = require('./application/usecases/setting/DeleteSettingUseCase');
const GetCounterListUseCase = require('./application/usecases/setting/GetCounterListUseCase');

const GetClassSectionListUseCase = require('./application/usecases/classSection/GetClassSectionListUseCase');
const CreateClassSectionUseCase = require('./application/usecases/classSection/CreateClassSectionUseCase');
const UpdateClassSectionUseCase = require('./application/usecases/classSection/UpdateClassSectionUseCase');
const DeleteClassSectionUseCase = require('./application/usecases/classSection/DeleteClassSectionUseCase');

const GetRegistrationListUseCase = require('./application/usecases/registration/GetRegistrationListUseCase');
const GetRegistrationByIdUseCase = require('./application/usecases/registration/GetRegistrationByIdUseCase');
const CreateRegistrationUseCase = require('./application/usecases/registration/CreateRegistrationUseCase');
const UpdateRegistrationUseCase = require('./application/usecases/registration/UpdateRegistrationUseCase');
const DeleteRegistrationUseCase = require('./application/usecases/registration/DeleteRegistrationUseCase');

const GetSemesterListUseCase = require('./application/usecases/semester/GetSemesterListUseCase');
const CreateSemesterUseCase = require('./application/usecases/semester/CreateSemesterUseCase');
const UpdateSemesterUseCase = require('./application/usecases/semester/UpdateSemesterUseCase');
const DeleteSemesterUseCase = require('./application/usecases/semester/DeleteSemesterUseCase');

const GetCourseListUseCase = require('./application/usecases/course/GetCourseListUseCase');
const GetCourseByIdUseCase = require('./application/usecases/course/GetCourseByIdUseCase');
const CreateCourseUseCase = require('./application/usecases/course/CreateCourseUseCase');
const UpdateCourseUseCase = require('./application/usecases/course/UpdateCourseUseCase');
const DeleteCourseUseCase = require('./application/usecases/course/DeleteCourseUseCase');
const GetTranslationCourseUseCase = require('./application/usecases/course/GetTranslationCourseUseCase');
const UpdateTranslationCourseUseCase = require('./application/usecases/course/UpdateTranslationCourseUseCase');
// ... import các usecase khác nếu cần

// Controllers
const StudentController = require('./presentation/controllers/StudentController');
const FacultyController = require('./presentation/controllers/FacultyController');
const ProgramController = require('./presentation/controllers/ProgramController');
const StatusController = require('./presentation/controllers/StatusController');
const LogController = require('./presentation/controllers/LogController');
const SettingController = require('./presentation/controllers/SettingController');
const ClassSectionController = require('./presentation/controllers/ClassSectionController');
const RegistrationController = require('./presentation/controllers/RegistrationController');
const SemesterController = require('./presentation/controllers/SemesterController');
const CourseController = require('./presentation/controllers/CourseController');
// ... import các controller khác nếu cần

const container = createContainer();

container.register({
  // Repository
  studentRepository: asClass(StudentRepository).singleton(),
  // Usecase
  getStudentListUseCase: asClass(GetStudentListUseCase).scoped(),
  getStudentByIdUseCase: asClass(GetStudentByIdUseCase).scoped(),
  createStudentUseCase: asClass(CreateStudentUseCase).scoped(),
  updateStudentUseCase: asClass(UpdateStudentUseCase).scoped(),
  deleteStudentUseCase: asClass(DeleteStudentUseCase).scoped(),
  // Controller
  studentController: asClass(StudentController).scoped(),
  
  // Faculty
  facultyRepository: asClass(FacultyRepository).singleton(),
  getFacultyListUseCase: asClass(GetFacultyListUseCase).scoped(),
  getFacultyByIdUseCase: asClass(GetFacultyByIdUseCase).scoped(),
  createFacultyUseCase: asClass(CreateFacultyUseCase).scoped(),
  updateFacultyUseCase: asClass(UpdateFacultyUseCase).scoped(),
  deleteFacultyUseCase: asClass(DeleteFacultyUseCase).scoped(),
  getTranslationFacultyUseCase: asClass(require('./application/usecases/faculty/GetTranslationFacultyUseCase')).scoped(),
  updateTranslationFacultyUseCase: asClass(require('./application/usecases/faculty/UpdateTranslationFacultyUseCase')).scoped(),
  facultyController: asClass(FacultyController).scoped(),
  // Program
  programRepository: asClass(ProgramRepository).singleton(),
  getProgramListUseCase: asClass(GetProgramListUseCase).scoped(),
  getProgramByIdUseCase: asClass(GetProgramByIdUseCase).scoped(),
  createProgramUseCase: asClass(CreateProgramUseCase).scoped(),
  updateProgramUseCase: asClass(UpdateProgramUseCase).scoped(),
  deleteProgramUseCase: asClass(DeleteProgramUseCase).scoped(),
  programController: asClass(ProgramController).scoped(),

  // Status
  statusRepository: asClass(StatusRepository).singleton(),
  getStatusListUseCase: asClass(GetStatusListUseCase).scoped(),
  createStatusUseCase: asClass(CreateStatusUseCase).scoped(),
  updateStatusUseCase: asClass(UpdateStatusUseCase).scoped(),
  deleteStatusUseCase: asClass(DeleteStatusUseCase).scoped(),
  statusController: asClass(StatusController).scoped(),

  // Log
  logRepository: asClass(LogRepository).singleton(),
  getLogListUseCase: asClass(GetLogListUseCase).scoped(),
  logController: asClass(LogController).scoped(),

  // Setting
  settingRepository: asClass(SettingRepository).singleton(),
  getSettingListUseCase: asClass(GetSettingListUseCase).scoped(),
  createSettingUseCase: asClass(CreateSettingUseCase).scoped(),
  updateSettingUseCase: asClass(UpdateSettingUseCase).scoped(),
  deleteSettingUseCase: asClass(DeleteSettingUseCase).scoped(),
  settingController: asClass(SettingController).scoped(),

  // ClassSection
  classSectionRepository: asClass(ClassSectionRepository).singleton(),
  getClassSectionListUseCase: asClass(GetClassSectionListUseCase).scoped(),
  classSectionController: asClass(ClassSectionController).scoped(),

  // Registration
  registrationRepository: asClass(RegistrationRepository).singleton(),
  getRegistrationListUseCase: asClass(GetRegistrationListUseCase).scoped(),
  getRegistrationByIdUseCase: asClass(GetRegistrationByIdUseCase).scoped(),
  createRegistrationUseCase: asClass(CreateRegistrationUseCase).scoped(),
  updateRegistrationUseCase: asClass(UpdateRegistrationUseCase).scoped(),
  deleteRegistrationUseCase: asClass(DeleteRegistrationUseCase).scoped(),
  registrationController: asClass(RegistrationController).scoped(),

  // Semester
  semesterRepository: asClass(SemesterRepository).singleton(),
  getSemesterListUseCase: asClass(GetSemesterListUseCase).scoped(),
  createSemesterUseCase: asClass(CreateSemesterUseCase).scoped(),
  updateSemesterUseCase: asClass(UpdateSemesterUseCase).scoped(),
  deleteSemesterUseCase: asClass(DeleteSemesterUseCase).scoped(),
  semesterController: asClass(SemesterController).scoped(),

  // Course
  courseRepository: asClass(CourseRepository).singleton(),
  getCourseListUseCase: asClass(GetCourseListUseCase).scoped(),
  getCourseByIdUseCase: asClass(GetCourseByIdUseCase).scoped(),
  createCourseUseCase: asClass(CreateCourseUseCase).scoped(),
  updateCourseUseCase: asClass(UpdateCourseUseCase).scoped(),
  deleteCourseUseCase: asClass(DeleteCourseUseCase).scoped(),
  getTranslationCourseUseCase: asClass(GetTranslationCourseUseCase).scoped(),
  updateTranslationCourseUseCase: asClass(UpdateTranslationCourseUseCase).scoped(),
  courseController: asClass(CourseController).scoped(),
});

module.exports = container;
