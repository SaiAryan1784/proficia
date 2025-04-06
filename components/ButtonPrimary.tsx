import React from "react";

interface ButtonPrimaryProps {
  text: string;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  onClick?: () => void;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ 
  text, 
  type = "button", 
  disabled = false,
  onClick 
}) => {
    return (
      <button 
        type={type} 
        disabled={disabled}
        onClick={onClick}
        className={`w-[280px] h-[70px] cursor-pointer px-10 py-5 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-400 rounded-[50px] inline-flex justify-center items-center gap-2 text-white text-[25px] animate-gradient transition-all duration-300 ${
          disabled 
            ? 'opacity-70 cursor-not-allowed' 
            : 'hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/50 active:scale-95'
        }`}
      >
        {text}
      </button>
    );
  };

export default ButtonPrimary;
