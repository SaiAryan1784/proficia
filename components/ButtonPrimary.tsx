import React from 'react';
import { Button } from '@/components/ui/button';

interface ButtonPrimaryProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  text?: string; // support legacy prop
  // add other legacy props if needed
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ children, text, className, ...props }) => {
  return (
    <Button
      className={className}
      {...props}
    >
      {text || children}
    </Button>
  );
};

export default ButtonPrimary;
