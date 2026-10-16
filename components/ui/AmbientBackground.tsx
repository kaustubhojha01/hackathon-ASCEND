'use client';

import React from 'react';

interface AmbientBackgroundProps {
  variant?: 'page' | 'section' | 'card';
  className?: string;
}

export function AmbientBackground({ variant = 'section', className = '' }: AmbientBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden pointer-events-none -z-10 ${className}`}
    >
      <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-purple-300/20 blur-3xl animate-ambient-orb-1" />
      <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-sky-300/15 blur-3xl animate-ambient-orb-2" />
      <div className="absolute -bottom-20 left-1/4 w-96 h-96 rounded-full bg-purple-400/15 blur-3xl animate-ambient-orb-3" />
    </div>
  );
}
