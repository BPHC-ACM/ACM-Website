// 'use client';
// import React, { useState } from 'react';
// import { Play } from 'lucide-react';

// const AnimatedPlayButton = () => {
//   const [isHovered, setIsHovered] = useState(false);
  
//   const handleRedirect = () => {
//     // Redirect to treasurehunt.tsx in the app/events folder
//     window.location.href = "../../events/treasurehunt";
//   };

//   return (
//     <div className="flex justify-center items-center w-full m-auto">
//       <div 
//         className="relative flex items-center justify-center cursor-pointer group max-w-sm w-full"
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         onClick={handleRedirect}
//       >
//         {/* Container that holds both elements with fixed width */}
//         <div className="flex items-center justify-center w-full max-w-sm mx-auto">
//           {/* Play button container */}
//           <div className={`
//             flex flex-col items-center
//             transition-all duration-500 ease-in-out
//             ${isHovered ? 'transform -translate-x-8' : 'mx-auto'}
//           `}>
//             <div className={`
//               relative
//               flex items-center justify-center
//               w-16 h-16 
//               rounded-full 
//               bg-gradient-to-br from-purple-500 to-pink-500
//               shadow-lg
//               transition-all duration-500 ease-in-out
//               ${isHovered ? 'scale-110' : 'scale-100'}
//             `}>
//               <div className={`
//                 absolute inset-0 
//                 bg-gradient-to-br from-purple-600 to-pink-600 
//                 rounded-full opacity-0 
//                 transition-opacity duration-500
//                 ${isHovered ? 'opacity-70' : 'opacity-0'}
//               `} />
              
//               <div className={`
//                 absolute -inset-1.5
//                 rounded-full
//                 border-2 border-purple-400
//                 opacity-0
//                 transition-all duration-500
//                 ${isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}
//               `} />
              
//               <Play 
//                 className={`
//                   text-white 
//                   transition-all duration-300 ease-in-out
//                   ${isHovered ? 'scale-125' : 'scale-100'}
//                 `} 
//                 size={24} 
//                 fill="white"
//               />
//             </div>
            
//             <span className={`
//               mt-2 
//               text-white font-medium text-sm
//               opacity-80
//               transition-all duration-300
//               ${isHovered ? 'opacity-100 translate-y-1' : 'opacity-80'}
//             `}>
//               Treasure Hunt
//             </span>
//           </div>
          
//           {/* Text container with fixed width */}
//           <div className={`
//             w-56
//             ml-4
//             flex flex-col
//             text-white
//             transition-all duration-500 ease-in-out
//             ${isHovered ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-4'}
//           `}>
//             <p className="text-base font-semibold mb-0.5 text-purple-300">
//               Great you made it till here!
//             </p>
//             <p className="text-sm text-pink-200">
//               Click here for the next clue
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AnimatedPlayButton;

// "use client"
// import { useState, useEffect } from "react"
// import { Play, Clock } from "lucide-react"

// const AnimatedPlayButton = () => {
//   const [isHovered, setIsHovered] = useState(false)
//   // Timer related state - HIGHLIGHTED TIMER CODE
//   const [timeRemaining, setTimeRemaining] = useState(5) // 10 second countdown
//   const [timerComplete, setTimerComplete] = useState(false)

//   // Timer effect - HIGHLIGHTED TIMER CODE
//   useEffect(() => {
//     if (timeRemaining > 0) {
//       const timer = setTimeout(() => {
//         setTimeRemaining((prev) => prev - 1)
//       }, 1000)

//       return () => clearTimeout(timer)
//     } else {
//       setTimerComplete(true)
//     }
//   }, [timeRemaining])

//   const handleRedirect = () => {
//     // Redirect to treasurehunt.tsx in the app/events folder
//     window.location.href = "../../events/treasurehunt"
//   }

//   return (
//     <div className="flex justify-center items-center w-full m-auto">
//       {/* HIGHLIGHTED TIMER CODE - Timer display when countdown is active */}
//       {!timerComplete ? (
//         <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm max-w-sm w-full">
//           <Clock className="text-purple-400 animate-pulse mb-3" size={32} />
//           <h3 className="text-xl font-bold text-white mb-2">Unlocking Treasure Hunt</h3>
//           <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
//             <div
//               className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
//               style={{ width: `${(timeRemaining / 10) * 100}%` }}
//             ></div>
//           </div>
//           <p className="text-white text-2xl font-mono">{timeRemaining}</p>
//           <p className="text-purple-200 text-sm mt-2">Please wait while we prepare your adventure...</p>
//         </div>
//       ) : (
//         // Original play button - only shown after timer completes
//         <div
//           className="relative flex items-center justify-center cursor-pointer group max-w-sm w-full"
//           onMouseEnter={() => setIsHovered(true)}
//           onMouseLeave={() => setIsHovered(false)}
//           onClick={handleRedirect}
//         >
//           {/* Container that holds both elements with fixed width */}
//           <div className="flex items-center justify-center w-full max-w-sm mx-auto">
//             {/* Play button container */}
//             <div
//               className={`
//               flex flex-col items-center
//               transition-all duration-500 ease-in-out
//               ${isHovered ? "transform -translate-x-8" : "mx-auto"}
//             `}
//             >
//               <div
//                 className={`
//                 relative
//                 flex items-center justify-center
//                 w-16 h-16 
//                 rounded-full 
//                 bg-gradient-to-br from-purple-500 to-pink-500
//                 shadow-lg
//                 transition-all duration-500 ease-in-out
//                 ${isHovered ? "scale-110" : "scale-100"}
//               `}
//               >
//                 <div
//                   className={`
//                   absolute inset-0 
//                   bg-gradient-to-br from-purple-600 to-pink-600 
//                   rounded-full opacity-0 
//                   transition-opacity duration-500
//                   ${isHovered ? "opacity-70" : "opacity-0"}
//                 `}
//                 />

//                 <div
//                   className={`
//                   absolute -inset-1.5
//                   rounded-full
//                   border-2 border-purple-400
//                   opacity-0
//                   transition-all duration-500
//                   ${isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"}
//                 `}
//                 />

//                 <Play
//                   className={`
//                     text-white 
//                     transition-all duration-300 ease-in-out
//                     ${isHovered ? "scale-125" : "scale-100"}
//                   `}
//                   size={24}
//                   fill="white"
//                 />
//               </div>

//               <span
//                 className={`
//                 mt-2 
//                 text-white font-medium text-sm
//                 opacity-80
//                 transition-all duration-300
//                 ${isHovered ? "opacity-100 translate-y-1" : "opacity-80"}
//               `}
//               >
//                 Treasure Hunt
//               </span>
//             </div>

//             {/* Text container with fixed width */}
//             <div
//               className={`
//               w-56
//               ml-4
//               flex flex-col
//               text-white
//               transition-all duration-500 ease-in-out
//               ${isHovered ? "opacity-100 transform translate-x-0" : "opacity-0 transform -translate-x-4"}
//             `}
//             >
//               <p className="text-base font-semibold mb-0.5 text-purple-300">Great you made it till here!</p>
//               <p className="text-sm text-pink-200">Click here for the next clue</p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default AnimatedPlayButton


"use client"
import { useState, useEffect } from "react"
import { Play, Clock } from "lucide-react"

const AnimatedPlayButton = () => {
  const [isHovered, setIsHovered] = useState(false)
  // HIGHLIGHTED TIMER CODE - Countdown to specific date
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [timerComplete, setTimerComplete] = useState(false)

  // HIGHLIGHTED TIMER CODE - Calculate time difference to target date
  useEffect(() => {
    const targetDate = new Date("March 27, 2025 08:00:00").getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const difference = targetDate - now

      if (difference <= 0) {
        setTimerComplete(true)
        return
      }

      // Calculate days, hours, minutes, seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeRemaining({ days, hours, minutes, seconds })
    }

    // Initial update
    updateCountdown()

    // Update every second
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleRedirect = () => {
    // Redirect to treasurehunt.tsx in the app/events folder
    window.location.href = "../../events/treasurehunt"
  }

  return (
    <div className="flex justify-center items-center w-full mt-10 m-auto">
      {/* HIGHLIGHTED TIMER CODE - Countdown display */}
      {!timerComplete ? (
        <div className="flex flex-col items-center justify-center p-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm max-w-sm w-full">
          <Clock className="text-purple-400 animate-pulse mb-3" size={32} />
          <h3 className="text-xl font-bold text-white mb-4">PEARL Treasure Hunt Begins In:</h3>

          <div className="grid grid-cols-4 gap-2 w-full mb-4">
            <div className="flex flex-col items-center">
              <div className="bg-purple-900/50 text-white text-2xl font-bold rounded-lg w-full py-3 text-center">
                {timeRemaining.days}
              </div>
              <span className="text-purple-200 text-xs mt-1">Days</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-900/50 text-white text-2xl font-bold rounded-lg w-full py-3 text-center">
                {timeRemaining.hours}
              </div>
              <span className="text-purple-200 text-xs mt-1">Hours</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-900/50 text-white text-2xl font-bold rounded-lg w-full py-3 text-center">
                {timeRemaining.minutes}
              </div>
              <span className="text-purple-200 text-xs mt-1">Minutes</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-900/50 text-white text-2xl font-bold rounded-lg w-full py-3 text-center">
                {timeRemaining.seconds}
              </div>
              <span className="text-purple-200 text-xs mt-1">Seconds</span>
            </div>
          </div>

          <p className="text-purple-200 text-sm mt-2">Get ready for an exciting adventure!</p>
        </div>
      ) : (
        // Original play button - only shown after timer completes
        <div
          className="relative flex items-center justify-center cursor-pointer group max-w-sm w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleRedirect}
        >
          {/* Container that holds both elements with fixed width */}
          <div className="flex items-center justify-center w-full max-w-sm mx-auto">
            {/* Play button container */}
            <div
              className={`
              flex flex-col items-center
              transition-all duration-500 ease-in-out
              ${isHovered ? "transform -translate-x-8" : "mx-auto"}
            `}
            >
              <div
                className={`
                relative
                flex items-center justify-center
                w-16 h-16 
                rounded-full 
                bg-gradient-to-br from-purple-500 to-pink-500
                shadow-lg
                transition-all duration-500 ease-in-out
                ${isHovered ? "scale-110" : "scale-100"}
              `}
              >
                <div
                  className={`
                  absolute inset-0 
                  bg-gradient-to-br from-purple-600 to-pink-600 
                  rounded-full opacity-0 
                  transition-opacity duration-500
                  ${isHovered ? "opacity-70" : "opacity-0"}
                `}
                />

                <div
                  className={`
                  absolute -inset-1.5
                  rounded-full
                  border-2 border-purple-400
                  opacity-0
                  transition-all duration-500
                  ${isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"}
                `}
                />

                <Play
                  className={`
                    text-white 
                    transition-all duration-300 ease-in-out
                    ${isHovered ? "scale-125" : "scale-100"}
                  `}
                  size={24}
                  fill="white"
                />
              </div>

              <span
                className={`
                mt-2 
                text-white font-medium text-sm
                opacity-80
                transition-all duration-300
                ${isHovered ? "opacity-100 translate-y-1" : "opacity-80"}
              `}
              >
                Treasure Hunt
              </span>
            </div>

            {/* Text container with fixed width */}
            <div
              className={`
              w-56
              ml-4
              flex flex-col
              text-white
              transition-all duration-500 ease-in-out
              ${isHovered ? "opacity-100 transform translate-x-0" : "opacity-0 transform -translate-x-4"}
            `}
            >
              <p className="text-base font-semibold mb-0.5 text-purple-300">Great you made it till here!</p>
              <p className="text-sm text-pink-200">Click here for the next clue</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnimatedPlayButton

