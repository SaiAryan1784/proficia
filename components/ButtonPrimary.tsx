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
    <div className="flex justify-center w-full">
      <button 
        type={type} 
        disabled={disabled}
        onClick={onClick}
        className={`
          cursor-pointer 
          bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400 
          rounded-[50px] 
          inline-flex justify-center items-center 
          text-white
          transition-all duration-300
          
          /* Responsive sizing */
          px-6 py-3 text-base sm:px-8 sm:py-4 sm:text-lg md:px-10 md:py-5 md:text-xl
          w-full sm:w-auto min-w-[200px] md:min-w-[250px]
          
          /* States */
          ${disabled 
            ? 'opacity-70 cursor-not-allowed' 
            : 'hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95'}
          
          /* Custom classes */
          ${className}
        `}
      >
        {text}
      </button>
    </div>
  );
};

export default ButtonPrimary;
