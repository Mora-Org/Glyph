import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs text-white/50 font-mono uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={`
          glass rounded-lg px-3 py-2 text-sm text-white
          placeholder:text-white/25 outline-none
          focus:border-white/20 transition-colors
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
