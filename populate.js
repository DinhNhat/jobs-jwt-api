require('dotenv').config();

const connectDB = require('./db/connect');
const Student = require('./models/Student');

const jsonStudents = require('./students.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Student.deleteMany();
    await Student.create(jsonStudents);
    console.log('Success!!!!');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

start();
