
const StudentRouter=require('./student');
const FacultyRouter=require('./faculty');
const ProgramRouter=require('./program');
const StatusRouter=require('./status');
const LogRouter=require('./log');
const SettingRouter=require('./setting');

function router(app)
{
    app.use('/api/students', StudentRouter);
    app.use('/api/faculties', FacultyRouter);
    app.use('/api/programs', ProgramRouter);
    app.use('/api/statuses', StatusRouter);
    app.use('/api/logs', LogRouter);
    app.use('/api/settings', SettingRouter);

}

module.exports = router