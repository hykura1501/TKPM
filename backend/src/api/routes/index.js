
const StudentRouter=require('./student');
const FacultyRouter=require('./faculty');
const ProgramRouter=require('./program');
const StatusRouter=require('./status');
const LogRouter=require('./log');

function router(app)
{
    app.use('/api/students', StudentRouter);
    app.use('/api/faculties', FacultyRouter);
    app.use('/api/programs', ProgramRouter);
    app.use('/api/statuses', StatusRouter);
    app.use('/api/logs', LogRouter);

}

module.exports = router