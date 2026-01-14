
import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils'; // We need to create this util first

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "block w-full py-3 border rounded-xl bg-[#fcfbf8] dark:bg-[#16181d] text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm",
              icon ? "pl-10 pr-3" : "px-3",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-border-color dark:border-gray-700",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-red-500 pl-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
