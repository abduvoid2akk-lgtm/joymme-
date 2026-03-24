import React from 'react';

interface CustomUserIconProps {
  size?: number;
  className?: string;
}

export const CustomUserIcon: React.FC<CustomUserIconProps> = ({ size = 24, className = "" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 512 512" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M256 256c61.856 0 112-50.144 112-112S317.856 32 256 32s-112 50.144-112 112 50.144 112 112 112zm128 32h-11.008c-35.456 17.344-75.456 27.456-116.992 27.456s-81.536-10.112-116.992-27.456H128C57.312 288 0 345.312 0 416v40c0 30.912 25.088 56 56 56h400c30.912 0 56-25.088 56-56v-40c0-70.688-57.312-128-128-128z" 
        fill="currentColor"
      />
    </svg>
  );
};
