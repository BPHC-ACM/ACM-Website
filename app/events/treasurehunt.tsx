// "use client"

// import React, { useState, useEffect } from 'react';

// const TreasureHunt: React.FC = () => {
//   const [answer, setAnswer] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [showError, setShowError] = useState(false);
//   const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });
  
//   // The correct answer to the riddle
//   const correctAnswer = 'shadow';
  
//   // Animated background effect
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setBgPosition(prev => ({
//         x: prev.x + 1,
//         y: prev.y + 1
//       }));
//     }, 50);
    
//     return () => clearInterval(interval);
//   }, []);
  
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (answer.toLowerCase().trim() === correctAnswer) {
//       // Open Google in a new tab
//       window.open('https://www.google.com', '_blank');
//     } else {
//       // Show error popup
//       setShowError(true);
//       setTimeout(() => setShowError(false), 3000); // Hide after 3 seconds
//     }
//   };
  
//   return (
//     <div 
//       className="min-h-screen flex flex-col items-center p-6 font-sans relative overflow-hidden"
//       style={{
//         background: `linear-gradient(120deg, #f093fb 0%, #f5576c 100%)`,
//         backgroundSize: '400% 400%',
//         animation: 'gradientAnimation 15s ease infinite'
//       }}
//     >
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         {[...Array(20)].map((_, i) => (
//           <div 
//             key={i}
//             className="absolute rounded-full opacity-20"
//             style={{
//               backgroundColor: i % 2 === 0 ? '#ffffff' : '#ff88cc',
//               width: `${20 + (i * 5)}px`,
//               height: `${20 + (i * 5)}px`,
//               top: `${Math.sin(i) * 50 + 50}%`,
//               left: `${(i * 5) % 100}%`,
//               transform: `translate(${Math.sin(i + bgPosition.x / 100) * 30}px, ${Math.cos(i + bgPosition.y / 100) * 30}px)`,
//               transition: 'transform 0.5s ease-out'
//             }}
//           />
//         ))}
//       </div>
      
//       {/* Logo Image */}
//       <div className="mt-8 mb-6 z-10">
//         <div className="w-32 h-32 bg-white rounded-full shadow-xl overflow-hidden border-4 border-pink-300 p-2">
//           <img 
//             src="/api/placeholder/128/128" 
//             alt="Treasure Hunt Logo" 
//             className="w-full h-full object-cover rounded-full"
//           />
//         </div>
//       </div>
      
//       {/* Title */}
//       <div className="mb-10 text-center z-10">
//         <h1 className="text-5xl font-bold text-white tracking-wider drop-shadow-lg">
//           TREASURE HUNT
//         </h1>
//         <div className="h-1 w-32 bg-yellow-400 mx-auto mt-2 rounded-full"></div>
//       </div>
      
//       {/* Main Content Container */}
//       <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm w-full max-w-md rounded-2xl shadow-2xl p-8 transition-all duration-500 hover:shadow-pink-400/50 z-10 border border-pink-200">
//         {/* Riddle Section */}
//         <div className="mb-8 text-center">
//           <div className="inline-block bg-pink-600 text-white px-4 py-2 rounded-full font-bold mb-4 transform -rotate-2 shadow-md">
//             Riddle #1
//           </div>
//           <p className="text-gray-700 italic text-lg leading-relaxed">
//             I follow you all the time and copy your every move, but you can't touch me or catch me. What am I?
//           </p>
//         </div>
        
//         {/* Answer Form */}
//         <form onSubmit={handleSubmit} className="mb-6">
//           <div className="mb-4 relative">
//             <input
//               type="text"
//               value={answer}
//               onChange={(e) => setAnswer(e.target.value)}
//               placeholder="Enter your answer..."
//               className="w-full px-6 py-3 rounded-full border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg transition-all duration-300"
//               required
//             />
//             {/* Removed the progress line that was here */}
//           </div>
//           <button 
//             type="submit" 
//             className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-6 rounded-full text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 active:scale-95"
//           >
//             Unlock Treasure
//           </button>
//         </form>
        
//         {/* Rules Button */}
//         <div className="text-center">
//           <button
//             onClick={() => setShowModal(true)}
//             className="text-pink-600 hover:text-purple-800 font-medium underline transition-colors duration-300 text-lg flex items-center justify-center mx-auto"
//           >
//             <span className="mr-2">📜</span> View Rules
//           </button>
//         </div>
//       </div>
      
//       {/* Rules Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-float-in relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500"></div>
//             <div className="flex justify-between items-center mb-6">
//               <h3 className="text-2xl font-bold text-pink-700">Treasure Hunter's Guide</h3>
//               <button 
//                 onClick={() => setShowModal(false)}
//                 className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
//               >
//                 ✕
//               </button>
//             </div>
//             <div className="mb-6 text-gray-700">
//               <ol className="space-y-3">
//                 <li className="flex items-start">
//                   <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">1</span>
//                   <span>Read the riddle carefully and ponder its meaning.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">2</span>
//                   <span>Type your answer in the treasure chest.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">3</span>
//                   <span>Each treasure hunt challenge must be solved to proceed.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">4</span>
//                   <span>Correct answers will unlock the next clue in your journey.</span>
//                 </li>
//                 <li className="flex items-start">
//                   <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">5</span>
//                   <span>The true treasure lies at the end of your quest!</span>
//                 </li>
//               </ol>
//             </div>
//             <button 
//               onClick={() => setShowModal(false)}
//               className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-4 rounded-full font-bold transition-colors duration-300 flex items-center justify-center"
//             >
//               <span className="mr-2">🗝️</span> Continue Adventure
//             </button>
//           </div>
//         </div>
//       )}
      
//       {/* Error Popup */}
//       {showError && (
//         <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg animate-shake z-50">
//           <div className="flex items-center">
//             <span className="text-red-500 mr-2">❌</span>
//             <p className="font-medium">Incorrect answer! Try another clue.</p>
//           </div>
//         </div>
//       )}
      
//       {/* Add CSS animations */}
//       <style jsx>{`
//         @keyframes gradientAnimation {
//           0% { background-position: 0% 50% }
//           50% { background-position: 100% 50% }
//           100% { background-position: 0% 50% }
//         }
        
//         @keyframes float-in {
//           from { opacity: 0; transform: translateY(20px) scale(0.95); }
//           to { opacity: 1; transform: translateY(0) scale(1); }
//         }
        
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//           20%, 40%, 60%, 80% { transform: translateX(5px); }
//         }
        
//         .animate-float-in {
//           animation: float-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
//         }
        
//         .animate-shake {
//           animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default TreasureHunt;

"use client"

import type React from "react"
import { useState, useEffect } from "react"

const TreasureHunt: React.FC = () => {
  const [answer, setAnswer] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showError, setShowError] = useState(false)
  const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 })

  // The correct answer to the riddle
  const correctAnswer = "shadow"

  // HIGHLIGHTED ANIMATION CODE - Enhanced background animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBgPosition((prev) => ({
        x: prev.x + 1,
        y: prev.y + 1,
      }))
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (answer.toLowerCase().trim() === correctAnswer) {
      // Open Google in a new tab
      window.open("https://www.google.com", "_blank")
    } else {
      // Show error popup
      setShowError(true)
      setTimeout(() => setShowError(false), 3000) // Hide after 3 seconds
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6 font-sans relative overflow-hidden"
      style={{
        background: `linear-gradient(120deg, #f093fb 0%, #f5576c 100%)`,
        backgroundSize: "400% 400%",
        animation: "gradientAnimation 15s ease infinite",
      }}
    >
      {/* HIGHLIGHTED ANIMATION CODE - Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              backgroundColor: i % 2 === 0 ? "#ffffff" : "#ff88cc",
              width: `${20 + i * 5}px`,
              height: `${20 + i * 5}px`,
              top: `${Math.sin(i) * 50 + 50}%`,
              left: `${(i * 5) % 100}%`,
              transform: `translate(${Math.sin(i + bgPosition.x / 100) * 30}px, ${Math.cos(i + bgPosition.y / 100) * 30}px)`,
              transition: "transform 0.5s ease-out",
            }}
          />
        ))}

        {/* HIGHLIGHTED ANIMATION CODE - Added animated stars */}
        {[...Array(30)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute rounded-full bg-white"
            style={{
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.6 + Math.random() * 0.4,
              animation: `twinkle ${3 + Math.random() * 5}s ease-in-out infinite ${Math.random() * 5}s`,
            }}
          />
        ))}

        {/* HIGHLIGHTED ANIMATION CODE - Added animated glow effects */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-purple-500 opacity-10 blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-pink-500 opacity-10 blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Logo Image */}
      <div className="mt-8 mb-6 z-10">
        <div className="w-32 h-32 bg-white rounded-full shadow-xl overflow-hidden border-4 border-pink-300 p-2">
          <img
            src="/placeholder.svg?height=128&width=128"
            alt="Treasure Hunt Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>

      {/* Title */}
      <div className="mb-10 text-center z-10">
        <h1 className="text-5xl font-bold text-white tracking-wider drop-shadow-lg">TREASURE HUNT</h1>
        <div className="h-1 w-32 bg-yellow-400 mx-auto mt-2 rounded-full"></div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm w-full max-w-md rounded-2xl shadow-2xl p-8 transition-all duration-500 hover:shadow-pink-400/50 z-10 border border-pink-200">
        {/* Riddle Section */}
        <div className="mb-8 text-center">
          <div className="inline-block bg-pink-600 text-white px-4 py-2 rounded-full font-bold mb-4 transform -rotate-2 shadow-md">
            Riddle #1
          </div>
          <p className="text-gray-700 italic text-lg leading-relaxed">
            I follow you all the time and copy your every move, but you can't touch me or catch me. What am I?
          </p>
        </div>

        {/* Answer Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="mb-4 relative">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full px-6 py-3 rounded-full border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg transition-all duration-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-6 rounded-full text-lg font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:rotate-1 active:scale-95"
          >
            Unlock Treasure
          </button>
        </form>

        {/* Rules Button */}
        <div className="text-center">
          <button
            onClick={() => setShowModal(true)}
            className="text-pink-600 hover:text-purple-800 font-medium underline transition-colors duration-300 text-lg flex items-center justify-center mx-auto"
          >
            <span className="mr-2">📜</span> View Rules
          </button>
        </div>
      </div>

      {/* Rules Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full animate-float-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500"></div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-pink-700">Treasure Hunter's Guide</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="mb-6 text-gray-700">
              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">
                    1
                  </span>
                  <span>Read the riddle carefully and ponder its meaning.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">
                    2
                  </span>
                  <span>Type your answer in the treasure chest.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">
                    3
                  </span>
                  <span>Each treasure hunt challenge must be solved to proceed.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">
                    4
                  </span>
                  <span>Correct answers will unlock the next clue in your journey.</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-2 font-bold">
                    5
                  </span>
                  <span>The true treasure lies at the end of your quest!</span>
                </li>
              </ol>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-4 rounded-full font-bold transition-colors duration-300 flex items-center justify-center"
            >
              <span className="mr-2">🗝️</span> Continue Adventure
            </button>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg animate-shake z-50">
          <div className="flex items-center">
            <span className="text-red-500 mr-2">❌</span>
            <p className="font-medium">Incorrect answer! Try another clue.</p>
          </div>
        </div>
      )}

      {/* HIGHLIGHTED ANIMATION CODE - Enhanced CSS animations */}
      <style jsx>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        
        @keyframes float-in {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .animate-float-in {
          animation: float-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        .animate-shake {
          animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
      `}</style>
    </div>
  )
}

export default TreasureHunt

