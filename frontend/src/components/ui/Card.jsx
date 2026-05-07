import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, hover = true, ...props }) => {
  return (
    <div 
      className={twMerge(
        "glass-card rounded-2xl p-4 overflow-hidden",
        hover && "hover:-translate-y-1",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
