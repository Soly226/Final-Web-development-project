import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from '../models/Student.js';
import Instructor from '../models/Instructor.js';
import Admin from '../models/Admin.js';

dotenv.config();

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.\n');

    console.log('--- ADMINS ---');
    const admins = await Admin.find({}, 'full_name email');
    admins.forEach(a => {
      console.log(`Name: ${a.full_name} | Email: ${a.email} | ID: ${a._id}`);
    });

    console.log('\n--- INSTRUCTORS ---');
    const instructors = await Instructor.find({}, 'full_name email');
    instructors.forEach(i => {
      console.log(`Name: ${i.full_name} | Email: ${i.email} | ID: ${i._id}`);
    });

    console.log('\n--- STUDENTS ---');
    const students = await Student.find({}, 'full_name email');
    students.forEach(s => {
      console.log(`Name: ${s.full_name} | Email: ${s.email} | ID: ${s._id}`);
    });

    console.log('\nUse these IDs to send messages or create notifications via API.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

listUsers();
