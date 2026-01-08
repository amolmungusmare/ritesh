import React from 'react';

export default function TMBLogo({ size = 'medium', className = '', showText = true }) {
  const sizes = {
    small: 'h-10',
    medium: 'h-14',
    large: 'h-20',
    xlarge: 'h-28'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img 
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695cce0ff2398c4e3069fe74/ba681f103_Screenshot_20260105-185413.jpg"
        alt="TMB Bank Logo"
        className={`${sizes[size]} object-contain`}
      />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-[#0033A0] ${size === 'small' ? 'text-sm' : size === 'medium' ? 'text-lg' : 'text-2xl'}`}>
            AgriSmart
          </span>
          <span className={`text-[#C01589] ${size === 'small' ? 'text-[10px]' : 'text-xs'}`}>
            Digital Agricultural Banking
          </span>
        </div>
      )}
    </div>
  );
}