'use client';
import React, { useState } from 'react';
import { Play } from 'lucide-react';

const AnimatedPlayButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleRedirect = () => {
    // Redirect to treasurehunt.tsx in the app/events folder
    window.location.href = "../../events/treasurehunt";
  };

  return (
    <div className="flex justify-center items-center w-full m-auto">
      <div 
        className="relative flex items-center justify-center cursor-pointer group max-w-sm w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleRedirect}
      >
        {/* Container that holds both elements with fixed width */}
        <div className="flex items-center justify-center w-full max-w-sm mx-auto">
          {/* Play button container */}
          <div className={`
            flex flex-col items-center
            transition-all duration-500 ease-in-out
            ${isHovered ? 'transform -translate-x-8' : 'mx-auto'}
          `}>
            <div className={`
              relative
              flex items-center justify-center
              w-16 h-16 
              rounded-full 
              bg-gradient-to-br from-purple-500 to-pink-500
              shadow-lg
              transition-all duration-500 ease-in-out
              ${isHovered ? 'scale-110' : 'scale-100'}
            `}>
              <div className={`
                absolute inset-0 
                bg-gradient-to-br from-purple-600 to-pink-600 
                rounded-full opacity-0 
                transition-opacity duration-500
                ${isHovered ? 'opacity-70' : 'opacity-0'}
              `} />
              
              <div className={`
                absolute -inset-1.5
                rounded-full
                border-2 border-purple-400
                opacity-0
                transition-all duration-500
                ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}
              `} />
              
              <Play 
                className={`
                  text-white 
                  transition-all duration-300 ease-in-out
                  ${isHovered ? 'scale-125' : 'scale-100'}
                `} 
                size={24} 
                fill="white"
              />
            </div>
            
            <span className={`
              mt-2 
              text-white font-medium text-sm
              opacity-80
              transition-all duration-300
              ${isHovered ? 'opacity-100 translate-y-1' : 'opacity-80'}
            `}>
              Treasure Hunt
            </span>
          </div>
          
          {/* Text container with fixed width */}
          <div className={`
            w-56
            ml-4
            flex flex-col
            text-white
            transition-all duration-500 ease-in-out
            ${isHovered ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-4'}
          `}>
            <p className="text-base font-semibold mb-0.5 text-purple-300">
              Great you made it till here!
            </p>
            <p className="text-sm text-pink-200">
              Click here for the next clue
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedPlayButton;