import React from 'react';
import { twMerge } from 'tailwind-merge';

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={twMerge('animate-pulse rounded-2xl bg-white/5 border border-white/5', className)}
      {...props}
    />
  );
}
