import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const LandingPage = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-3xl">school</span>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">EduCore</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#features">
                Courses
              </a>
              <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#resources">
                Resources
              </a>
              <a className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary transition-colors" href="#pricing">
                Pricing
              </a>
            </div>
            <div className="flex items-center gap-4">
              <Link className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors" to="/login">
                Login
              </Link>
              <Link to="/register">
                <Button className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                New Version 2.0 Now Live
              </div>
              <div className="flex flex-col gap-4">
                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tight">
                  Mini Learning Management System
                </h1>
                <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
                  Streamline your classroom with our integrated academic tools designed for modern educators and students. Simple, powerful, and built for growth.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button className="bg-primary text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                    Register Now
                  </Button>
                </Link>
                <Button className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  View Live Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video lg:aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/10 overflow-hidden shadow-2xl group">
                <img
                  alt="Student learning with tablet"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:scale-105 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSqQg19arvUXNhfRobIoEE7JGl5wTQMO7cBAhHe3k_vxcHv9Vxz3oNgiwOfQ_U6S0yQVzaiKUvqAau_fAyX20zijpecaSbr6f5hRyqNUT_QbFJT38zumKTB-3ow_DoNdkXFLiNtE4n_1kHqsgdvX5YtnYnlvF6VO4PQPHh49qYlSFCVk3OtHyd-t6uT-5GvbiKA8WYZX64xBxyUJ5vUuYcaSLllDyk3p-l4_qIQt98BYxVZFifbc20JqYxmH5Ofe0Z2pYNz5x2NjI"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">System Performance</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">99.9% Uptime</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-background-dark/50 border-y border-slate-200 dark:border-slate-800" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold text-sm tracking-widest uppercase mb-3">Core Features</h2>
            <h3 className="text-3xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Everything you need to succeed
            </h3>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
              Designed by educators, for educators. Focus on teaching while we handle the logistics of digital classroom management.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Course Management */}
            <div className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">book_2</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Course Management</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Organize curriculum, syllabus, and multimedia learning materials with a simple drag-and-drop interface.
              </p>
              <a className="inline-flex items-center text-primary font-bold text-sm hover:gap-2 transition-all" href="#">
                Learn more <span className="material-symbols-outlined text-sm">chevron_right</span>
              </a>
            </div>

            {/* Assignment System */}
            <div className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">assignment</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Assignment System</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Create, distribute, and collect student work digitally. Set deadlines and automated reminders effortlessly.
              </p>
              <a className="inline-flex items-center text-primary font-bold text-sm hover:gap-2 transition-all" href="#">
                Learn more <span className="material-symbols-outlined text-sm">chevron_right</span>
              </a>
            </div>

            {/* Grade Tracking */}
            <div className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
              <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">analytics</span>
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Grade Tracking</h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                Monitor performance with comprehensive grading analytics and visual progress reports for every student.
              </p>
              <a className="inline-flex items-center text-primary font-bold text-sm hover:gap-2 transition-all" href="#">
                Learn more <span className="material-symbols-outlined text-sm">chevron_right</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-8 lg:p-16">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mb-6">
              Ready to transform your teaching?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-10 text-lg">
              Join thousands of educators who have simplified their digital workflow with EduCore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-primary text-white px-10 py-4 rounded-xl text-base font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-primary/25">
                  Create Free Account
                </Button>
              </Link>
              <Button className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-10 py-4 rounded-xl text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-background-dark py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">school</span>
              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">EduCore</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8">
              <a className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">
                Terms of Service
              </a>
              <a className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">
                Contact Us
              </a>
              <a className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors" href="#">
                Help Center
              </a>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-slate-200 dark:border-slate-800/50">
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              © 2024 EduCore LMS. All rights reserved. Designed for excellence in education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;