/**
 * Form components for React Hook Form integration
 */
import React from 'react';

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function FormItem({ className = '', children, ...props }: FormItemProps) {
  return (
    <div className={`space-y-2 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function FormLabel({ className = '', children, ...props }: FormLabelProps) {
  return (
    <label 
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function FormControl({ children, ...props }: FormControlProps) {
  return <div {...props}>{children}</div>;
}

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export function FormMessage({ className = '', children, ...props }: FormMessageProps) {
  if (!children) return null;
  
  return (
    <p className={`text-sm font-medium text-destructive ${className}`} {...props}>
      {children}
    </p>
  );
}