import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-sm tracking-wide";
  
  const variants = {
    primary: "bg-gradient-to-br from-primary to-accent text-white shadow-primary/30 hover:shadow-primary/50 hover:brightness-110",
    secondary: "glass text-slate-700 dark:text-slate-200 border-white/20 hover:bg-white/40 dark:hover:bg-slate-800/80 shadow-sm",
    ghost: "bg-transparent hover:bg-primary/10 text-slate-600 dark:text-slate-400 shadow-none hover:text-primary transition-colors",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
  };

  return (
    <button 
      className={twMerge(baseStyles, variants[variant], className)} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
