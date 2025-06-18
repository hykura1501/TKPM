// Script: Import sample data from data-sample to database
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const SAMPLE_DIR = path.resolve(__dirname, './data');
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-management';

function transformDoc(doc) {
  // Chuyển _id: { $oid: ... } => _id: ...
  if (doc._id && typeof doc._id === 'object' && doc._id.$oid) {
    doc._id = doc._id.$oid;
  }
  // Chuyển các trường có $date thành Date
  for (const key in doc) {
    if (doc[key] && typeof doc[key] === 'object') {
      if ('$date' in doc[key]) {
        doc[key] = new Date(doc[key]['$date']);
      } else {
        // Đệ quy cho object lồng nhau
        transformDoc(doc[key]);
      }
    }
  }
  return doc;
}

async function importCollection(fileName, collectionName) {
  const filePath = path.join(SAMPLE_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  if (!Array.isArray(data)) {
    console.log(`File ${fileName} does not contain an array.`);
    return;
  }
  // Chuyển đổi dữ liệu
  const transformed = data.map(transformDoc);
  const collection = mongoose.connection.collection(collectionName);
  await collection.deleteMany({});
  await collection.insertMany(transformed);
  console.log(`Imported ${transformed.length} documents into ${collectionName}`);
}

async function main() {
  await mongoose.connect(MONGO_URI);
  // Map file to collection name
  const mapping = {
    'student-dashboard.classsections.json': 'classsections',
    'student-dashboard.counters.json': 'counters',
    'student-dashboard.courses.json': 'courses',
    'student-dashboard.faculties.json': 'faculties',
    'student-dashboard.logs.json': 'logs',
    'student-dashboard.programs.json': 'programs',
    'student-dashboard.registrations.json': 'registrations',
    'student-dashboard.settings.json': 'settings',
    'student-dashboard.statuses.json': 'statuses',
    'student-dashboard.students.json': 'students',
  };
  for (const [file, collection] of Object.entries(mapping)) {
    await importCollection(file, collection);
  }
  await mongoose.disconnect();
  console.log('All sample data imported!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
