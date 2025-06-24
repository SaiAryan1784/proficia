import React from "react";

interface ButtonPrimaryProps {
  text: string;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ 
  text, 
  type = "button", 
  disabled = false,
  onClick,
  className = ""
}) => {
    return (
      <button 
        type={type} 
        disabled={disabled}
        onClick={onClick}
        className={`
          cursor-pointer 
          bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400 
          rounded-lg 
          inline-flex justify-center items-center 
          text-white
          font-medium
          transition-all duration-300
          
          /* Responsive sizing - smaller and more reasonable */
          px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base
          w-full max-w-xs
          
          /* States */
          ${disabled 
            ? 'opacity-70 cursor-not-allowed' 
            : 'hover:shadow-md hover:shadow-indigo-500/25 active:scale-[0.98]'}
          
          /* Custom classes */
          ${className}
        `}
      >
        {text}
      </button>
    );
  };

export default ButtonPrimary;
