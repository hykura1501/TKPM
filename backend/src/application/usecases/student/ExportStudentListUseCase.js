// Usecase: ExportStudentListUseCase
// Clean Architecture: Application Layer

const { Parser: Json2csvParser } = require('json2csv');
const ExcelJS = require('exceljs');
const js2xmlparser = require('js2xmlparser');
const mapper = require('@shared/utils/mapper');
const { addLogEntry } = require('@shared/utils/logging');

class ExportStudentListUseCase {
    /**
   * @param {object} params
   * @param {import('@domain/repositories/IStudentRepository')} params.studentRepository - Repository thao tác sinh viên
   * @param {import('@domain/repositories/IFacultyRepository')} params.facultyRepository - Repository thao tác khoa
   * @param {import('@domain/repositories/IProgramRepository')} params.programRepository - Repository thao tác chương trình đào tạo
   * @param {import('@domain/repositories/IStatusRepository')} params.statusRepository - Repository thao tác trạng thái sinh viên
   */
  constructor({ studentRepository, facultyRepository, programRepository, statusRepository }) {
    this.studentRepository = studentRepository;
    this.facultyRepository = facultyRepository;
    this.programRepository = programRepository;
    this.statusRepository = statusRepository;
  }
  
  // Helper: Phẳng hóa dữ liệu student, map id sang tên
  flattenStudent(student, { facultyMap, programMap, statusMap, locale }) {
    return {
      mssv: student.mssv,
      fullName: student.fullName,
      dateOfBirth: student.dateOfBirth,
      gender: this.mapperGenderName(student.gender),
      faculty: mapper.formatFaculty(facultyMap[student.faculty], locale)?.name || student.faculty,
      course: student.course,
      program: mapper.formatProgram(programMap[student.program], locale)?.name || student.program,
      permanentAddress_streetAddress: student.permanentAddress?.streetAddress,
      permanentAddress_ward: student.permanentAddress?.ward,
      permanentAddress_district: student.permanentAddress?.district,
      permanentAddress_province: student.permanentAddress?.province,
      permanentAddress_country: student.permanentAddress?.country,
      temporaryAddress_streetAddress: student.temporaryAddress?.streetAddress,
      temporaryAddress_ward: student.temporaryAddress?.ward,
      temporaryAddress_district: student.temporaryAddress?.district,
      temporaryAddress_province: student.temporaryAddress?.province,
      temporaryAddress_country: student.temporaryAddress?.country,
      mailingAddress_streetAddress: student.mailingAddress?.streetAddress,
      mailingAddress_ward: student.mailingAddress?.ward,
      mailingAddress_district: student.mailingAddress?.district,
      mailingAddress_province: student.mailingAddress?.province,
      mailingAddress_country: student.mailingAddress?.country,
      identityDocument_type: student.identityDocument?.type,
      identityDocument_number: student.identityDocument?.number,
      identityDocument_issueDate: student.identityDocument?.issueDate,
      identityDocument_issuePlace: student.identityDocument?.issuePlace,
      identityDocument_expiryDate: student.identityDocument?.expiryDate,
      identityDocument_hasChip: student.identityDocument?.hasChip,
      identityDocument_issuingCountry: student.identityDocument?.issuingCountry,
      identityDocument_notes: student.identityDocument?.notes,
      nationality: student.nationality,
      email: student.email,
      phone: student.phone,
      status: mapper.formatStatus(statusMap[student.status], locale)?.name || student.status,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt
    };
  }
  mapperGenderName(gender, locale) {
    const genders = {
      vi: { male: 'Nam', female: 'Nữ', other: 'Khác' },
      en: { male: 'Male', female: 'Female', other: 'Other' }
    };
    if (!gender) return '';
    const lang = genders[locale] || genders['vi'];
    return lang[gender] || gender;
  }

  /**
   * Export danh sách sinh viên ra các định dạng file
   * @param {object} params
   * @param {'csv'|'excel'|'xml'|'json'} [params.format] - Định dạng file export
   * @param {string} [params.locale] - Ngôn ngữ (vi, en...)
   * @returns {Promise<{fileContent: any, fileName: string, contentType: string, isExcel: boolean}>}
   */
  async execute({ format, locale = 'vi' } = {}) {
    const students = await this.studentRepository.getAllStudents();
    const faculties = await this.facultyRepository.findAll();
    const programs = await this.programRepository.findAll();
    const statuses = await this.statusRepository.findAll();
    // Map id sang entity
    const facultyMap = Object.fromEntries(faculties.map(f => [f.id, f]));
    const programMap = Object.fromEntries(programs.map(p => [p.id, p]));
    const statusMap = Object.fromEntries(statuses.map(s => [s.id, s]));
    let exportData = students;
    if (["csv", "excel"].includes(format)) {
      exportData = students.map(s => this.flattenStudent(s, { facultyMap, programMap, statusMap, locale }));
    }
    let fileContent, fileName, contentType;
    switch (format) {
      case 'csv':
        fileName = 'students.csv';
        contentType = 'text/csv';
        fileContent = new Json2csvParser().parse(exportData);
        break;
      case 'excel':
        fileName = 'students.xlsx';
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Students');
        worksheet.columns = Object.keys(exportData[0] || {}).map(key => ({ header: key, key }));
        worksheet.addRows(exportData);
        // Trả về workbook để controller xử lý stream
        fileContent = workbook;
        break;
      case 'xml':
        fileName = 'students.xml';
        contentType = 'application/xml';
        //Mapping id sang tên
        const xmlExportData = students.map(s => {
          const data = { ...(s._doc || s) };
          delete data._id;
          delete data.__v;
          return data;
        });
        xmlExportData.forEach(s => {
          s.faculty = mapper.formatFaculty(facultyMap[s.faculty], locale)?.name || s.faculty;
          s.program = mapper.formatProgram(programMap[s.program], locale)?.name || s.program;
          s.status = mapper.formatStatus(statusMap[s.status], locale)?.name || s.status;
          s.gender = this.mapperGenderName(s.gender, locale);
        });
        fileContent = js2xmlparser.parse('students', xmlExportData);
        break;
      case 'json':
      default:
        fileName = 'students.json';
        contentType = 'application/json';
        const jsonExportData = students.map(s => {
          const data = { ...(s._doc || s) };
          delete data._id;
          delete data.__v;
          return data;
        });
        // Mapping id sang tên
        jsonExportData.forEach(s => {
          s.faculty = mapper.formatFaculty(facultyMap[s.faculty], locale)?.name || s.faculty;
          s.program = mapper.formatProgram(programMap[s.program], locale)?.name || s.program;
          s.status = mapper.formatStatus(statusMap[s.status], locale)?.name || s.status;
          s.gender = this.mapperGenderName(s.gender, locale);
        });

        fileContent = JSON.stringify(jsonExportData, null, 2);
    }
    await addLogEntry({
      message: `Export student list to ${format}`,
      level: 'info',
      action: 'export',
      entity: 'student',
      user: 'admin',
      details: `Exported student list, count: ${students.length}`
    });
    return { fileContent, fileName, contentType, isExcel: format === 'excel' };
  }
}

module.exports = ExportStudentListUseCase;
