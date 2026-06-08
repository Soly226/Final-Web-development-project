import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { useSettings } from '../context/SettingsContext';
import { getFileUrl } from '../lib/apiClient';

/* ─────────────────────────────────────────────
   Static Feature / Testimonial / Stat Data
───────────────────────────────────────────── */
const features = [
  {
    icon: 'auto_awesome',
    title: 'AI-Powered Learning',
    desc: 'Adaptive curriculum that evolves with your pace. Get personalised recommendations powered by next-gen AI.',
    gradient: 'from-primary to-accent',
  },
  {
    icon: 'timeline',
    title: 'Progress Tracking',
    desc: 'Visualise your academic journey with rich analytics, streak counters, and milestone celebrations.',
    gradient: 'from-cyan-500 to-primary',
  },
  {
    icon: 'groups',
    title: 'Live Collaboration',
    desc: 'Real-time course streams, peer discussions, and instructor Q&A sessions in one seamless space.',
    gradient: 'from-accent to-pink-500',
  },
  {
    icon: 'workspace_premium',
    title: 'Verified Certificates',
    desc: 'Earn industry-recognised credentials upon course completion and share them directly to LinkedIn.',
    gradient: 'from-emerald-500 to-cyan-500',
  },
  {
    icon: 'calendar_month',
    title: 'Smart Scheduling',
    desc: 'Integrated academic calendar syncs deadlines, lectures, and office hours so you never miss a beat.',
    gradient: 'from-orange-500 to-rose-500',
  },
  {
    icon: 'shield_with_heart',
    title: 'Secure & Private',
    desc: 'Enterprise-grade security with end-to-end encryption for all your academic data and communications.',
    gradient: 'from-violet-500 to-primary',
  },
];

const stats = [
  { value: 12840, suffix: '+', label: 'Active Students' },
  { value: 452, suffix: '+', label: 'Live Courses' },
  { value: 98, suffix: '%', label: 'Satisfaction Rate' },
  { value: 120, suffix: '+', label: 'Expert Instructors' },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Computer Science Student',
    avatar: 'S',
    color: 'from-primary to-accent',
    quote: 'EduCore completely transformed how I study. The AI recommendations are spot-on and the progress tracking keeps me motivated every single day.',
  },
  {
    name: 'Prof. Michael Chen',
    role: 'Senior Instructor',
    avatar: 'M',
    color: 'from-emerald-500 to-cyan-500',
    quote: 'Managing my courses has never been easier. The analytics dashboard gives me real insights into student performance, enabling truly personalised teaching.',
  },
  {
    name: 'Amir Al-Rashid',
    role: 'MBA Graduate',
    avatar: 'A',
    color: 'from-orange-500 to-rose-500',
    quote: 'I landed my dream job six months after completing the Business Analytics track on EduCore. The verified certificate made all the difference.',
  },
];

/* ─────────────────────────────────────────────
   Animated Counter Hook
───────────────────────────────────────────── */
const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */
const FeatureCard = ({ icon, title, desc, gradient }) => (
  <div className="group glass-card rounded-2xl p-6 flex flex-col gap-4 cursor-default">
    <div className={twMerge('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3', gradient)}>
      <span className="material-symbols-outlined text-white text-2xl">{icon}</span>
    </div>
    <div>
      <h3 className="text-slate-900 dark:text-white font-bold text-base mb-1">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const StatItem = ({ value, suffix, label, animate }) => {
  const count = useCounter(value, 2000, animate);
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-4xl md:text-5xl font-extrabold text-white text-glow">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-sm text-slate-300 font-medium tracking-wide">{label}</span>
    </div>
  );
};

const TestimonialCard = ({ name, role, avatar, color, quote }) => (
  <div className="glass rounded-2xl p-6 flex flex-col gap-4 min-w-[300px] max-w-sm flex-shrink-0">
    <div className="flex items-center gap-3">
      <div className={twMerge('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-black text-lg shadow-md', color)}>
        {avatar}
      </div>
      <div>
        <p className="text-slate-900 dark:text-white font-bold text-sm">{name}</p>
        <p className="text-slate-500 dark:text-slate-400 text-xs">{role}</p>
      </div>
    </div>
    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">"{quote}"</p>
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="material-symbols-outlined text-amber-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   Main Landing Page
───────────────────────────────────────────── */
const LandingPage = () => {
  const [statsVisible, setStatsVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { logoUrl } = useSettings();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      // Trigger stat counters when user scrolls past 40%
      if (window.scrollY > window.innerHeight * 0.8) {
        setStatsVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-background-dark min-h-screen font-display text-white overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className={twMerge(
        'fixed top-0 left-0 w-full z-50 transition-all duration-500',
        scrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' : 'py-5 bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30 overflow-hidden">
              {logoUrl ? (
                <img src={getFileUrl(logoUrl)} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              )}
            </div>
            <span className="text-lg font-extrabold tracking-tight text-white">EduCore</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Stats', 'Testimonials'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-br from-primary to-accent text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-lg shadow-primary/30 hover:brightness-110 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/20 blur-[130px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-2/3 left-1/2 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            <span className="text-xs font-semibold text-slate-300 tracking-wider">NEXT-GEN LEARNING PLATFORM</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
            <span className="text-white">Learn Without</span>
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-cyan-400 text-transparent bg-clip-text">
              Limits.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            EduCore transforms traditional education into an immersive, AI-powered experience.
            Join thousands of students and instructors already redefining what learning looks like.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group w-full sm:w-auto bg-gradient-to-br from-primary to-accent text-white font-bold py-4 px-8 rounded-2xl shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Start Learning Free</span>
              <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
            <Link
              to="/login"
              className="group w-full sm:w-auto glass border border-white/20 text-white font-bold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-xl text-primary">play_circle</span>
              <span>Sign In</span>
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex -space-x-3">
              {['from-primary to-accent', 'from-emerald-500 to-cyan-500', 'from-orange-500 to-rose-500', 'from-violet-500 to-pink-500'].map((g, i) => (
                <div key={i} className={twMerge('w-10 h-10 rounded-full bg-gradient-to-br border-2 border-slate-950 flex items-center justify-center text-white text-xs font-black', g)}>
                  {['S', 'M', 'A', 'J'][i]}
                </div>
              ))}
            </div>
            <p className="text-slate-400 text-sm">
              <span className="text-white font-bold">12,840+</span> students already enrolled
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
          <span className="material-symbols-outlined text-slate-400">keyboard_arrow_down</span>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Why EduCore</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need to
            <br />
            <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">Succeed</span>
          </h2>
          <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base leading-relaxed">
            From AI-driven recommendations to real-time collaboration — EduCore is built for the future of education.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="relative px-6 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 blur-[120px] rounded-full" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Trusted by Learners Worldwide</h2>
            <p className="text-slate-300 mt-3 text-base">Numbers that speak for themselves.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((s) => (
              <StatItem key={s.label} {...s} animate={statsVisible} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-black uppercase tracking-[0.2em] text-primary mb-3">Voices</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Real People,{' '}
            <span className="bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">Real Results</span>
          </h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {testimonials.map((t) => (
            <div key={t.name} className="snap-start">
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <div className="relative glass rounded-3xl p-10 md:p-16 overflow-hidden border border-white/10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 blur-[80px] rounded-full -ml-20 -mb-20 pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-xl shadow-primary/30 mb-6">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">Ready to Launch Your Journey?</h2>
            <p className="text-slate-400 text-base mb-8 max-w-md mx-auto leading-relaxed">
              Join EduCore today and get instant access to 450+ courses, AI mentorship, and a vibrant learning community.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-br from-primary to-accent text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-primary/30 hover:brightness-110 transition-all active:scale-95"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto text-slate-300 font-semibold hover:text-white transition-colors text-sm"
              >
                Already have an account? Sign in →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
              {logoUrl ? (
                <img src={getFileUrl(logoUrl)} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-white text-base" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              )}
            </div>
            <span className="text-sm font-bold text-white">EduCore LMS</span>
          </div>
          <p className="text-xs text-slate-500">© 2026 EduCore. All rights reserved. Built for the future of education.</p>
          <div className="flex gap-5 text-slate-500 text-xs font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
