import React from 'react';
import { useSurat } from '../context/SuratContext';

export default function Toast() {
  const { toast } = useSurat();

  if (!toast) return null;

  const bgColors = {
    success: 'bg-success text-white border-success-dark shadow-md',
    info: 'bg-primary text-white border-primary-dark shadow-md',
    warning: 'bg-warning-dark text-white border-yellow-700 shadow-md',
    danger: 'bg-accent text-white border-accent-dark shadow-md',
  };

  const icons = {
    success: 'check_circle',
    info: 'info',
    warning: 'warning',
    danger: 'error',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div
        className={`flex items-center gap-2.5 px-4 py-3 rounded-card shadow-xl border text-sm font-medium ${
          bgColors[toast.type] || bgColors.success
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">
          {icons[toast.type] || icons.success}
        </span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
