import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses = {
    default: 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary border border-primary/30',
    success: 'bg-gradient-to-r from-success to-success/80 text-white shadow-lg',
    warning: 'bg-gradient-to-r from-warning to-warning/80 text-white shadow-lg',
    error: 'bg-gradient-to-r from-error to-error/80 text-white shadow-lg',
    info: 'bg-gradient-to-r from-info to-info/80 text-white shadow-lg',
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-md transition-all duration-200 ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
