import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import SystemLog from '../models/SystemLog.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await SystemLog.deleteMany();

    // Create users
    const admin = await User.create({
      name: 'Jonathan Admin',
      email: 'admin@educore.com',
      password: 'password123',
      role: 'admin',
    });

    const instructor = await User.create({
      name: 'Seliem Instructor',
      email: 'instructor@educore.com',
      password: 'password123',
      role: 'instructor',
    });

    const student = await User.create({
      name: 'Magdy Student',
      email: 'student@educore.com',
      password: 'password123',
      role: 'student',
    });

    console.log('Users seeded successfully');

    // Create logs
    await SystemLog.create([
      { level: 'info', message: 'System initialized', source: 'Core' },
      { level: 'warning', message: 'High CPU usage detected', source: 'Monitor' },
      { level: 'info', message: 'Admin logged in', source: 'Auth', metadata: { user: 'admin@educore.com' } },
      { level: 'error', message: 'Failed to send notification email', source: 'EmailService' },
    ]);

    console.log('System logs seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
