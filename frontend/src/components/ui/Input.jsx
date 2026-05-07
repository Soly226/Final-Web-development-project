import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, id, error, className, icon: Icon, ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-slate-700 dark:text-slate-300 text-sm font-medium mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={id}
          className={twMerge(
            "w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none",
            error && "border-rose-500 focus:ring-rose-200 focus:border-rose-500",
            Icon && "pr-10",
            className
          )}
          {...props}
        />
        {Icon && (
          <div className="absolute right-3 text-slate-400">
            {Icon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Input;
