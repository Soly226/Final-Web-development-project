const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('./models/Student');
const Instructor = require('./models/Instructor');
const Admin = require('./models/Admin');
const dotenv = require('dotenv');

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const email = 'john@student.com';
    const plainPassword = 'password123';

    const student = await Student.findOne({ email });
    if (!student) {
      console.log('Student not found in DB!');
      process.exit(1);
    }

    console.log('Stored hashed password:', student.password);
    const isMatch = await bcrypt.compare(plainPassword, student.password);
    console.log('Does password match? (bcrypt.compare):', isMatch);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testLogin();
