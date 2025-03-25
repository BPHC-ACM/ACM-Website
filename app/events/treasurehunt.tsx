'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';

const TreasureHunt: React.FC = () => {
	const [answer, setAnswer] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [showError, setShowError] = useState(false);
	const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });

	// The correct answer to the riddle
	const correctAnswer = 'shadow';

	// Enhanced background animation
	useEffect(() => {
		const interval = setInterval(() => {
			setBgPosition((prev) => ({
				x: prev.x + 1,
				y: prev.y + 1,
			}));
		}, 50);

		return () => clearInterval(interval);
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (answer.toLowerCase().trim() === correctAnswer) {
			// Open Google in a new tab
			window.open('https://www.google.com', '_blank');
		} else {
			// Show error popup
			setShowError(true);
			setTimeout(() => setShowError(false), 3000); // Hide after 3 seconds
		}
	};

	return (
		<div
			className='md:w-[28rem] w-[20rem] md:-mt-32 -mt-16 mb-12 rounded-2xl h-[28rem] mx-auto flex flex-col items-center justify-center md:p-6 p-4 font-sans relative overflow-hidden'
			style={{
				background: `linear-gradient(120deg, oklch(0.905 0.093 164.15) 0%, oklch(0.845 0.143 164.978) 100%)`,
				backgroundSize: '400% 400%',
				animation: 'gradientAnimation 15s ease infinite',
			}}
		>
			{/* Animated background elements */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				{/* Twinkling stars/particles */}
				{[...Array(20)].map((_, i) => (
					<div
						key={`star-${i}`}
						className='absolute rounded-full bg-white'
						style={{
							width: `${2 + Math.random() * 3}px`,
							height: `${2 + Math.random() * 3}px`,
							top: `${Math.random() * 100}%`,
							left: `${Math.random() * 100}%`,
							opacity: 0.6 + Math.random() * 0.4,
							animation: `twinkle ${
								3 + Math.random() * 5
							}s ease-in-out infinite ${Math.random() * 5}s`,
						}}
					/>
				))}
			</div>

			{/* Main Content Container */}
			<div className='w-full max-w-md bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-xl shadow-2xl p-4 z-10 border border-pink-200'>
				{/* Logo */}
				<div className='flex justify-center mb-4'>
					<div className='w-16 h-16 bg-yellow-400 rounded-full shadow-xl overflow-hidden border-4 border-pink-300'>
						<img
							src='/pearl-logo.png?height=64&width=64'
							alt='Pearl Logo'
							className='w-full h-full object-cover rounded-full'
						/>
					</div>
				</div>

				{/* Title */}
				<div className='text-center mb-4'>
					<h1 className='text-2xl font-bold text-gray-800 tracking-wider'>
						TREASURE HUNT
					</h1>
					<div className='h-1 w-20 bg-yellow-400 mx-auto mt-2 rounded-full'></div>
				</div>

				{/* Riddle Section */}
				<div className='mb-4 text-center'>
					<div className='inline-block bg-pink-600 text-white px-3 py-1 rounded-full font-bold mb-2 text-xs'>
						Riddle #1
					</div>
					<p className='text-gray-700 italic text-sm leading-relaxed'>
						I follow you all the time and copy your every move, but
						you can't touch me or catch me. What am I?
					</p>
				</div>

				{/* Answer Form */}
				<form onSubmit={handleSubmit} className='mb-4'>
					<input
						type='text'
						value={answer}
						onChange={(e) => setAnswer(e.target.value)}
						placeholder='Enter your answer...'
						className='w-full px-3 py-2 rounded-full border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm mb-3'
						required
					/>
					<button
						type='submit'
						className='w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-full text-sm font-bold hover:from-pink-600 hover:to-pink-700 transition-colors'
					>
						Unlock Treasure
					</button>
				</form>

				{/* Rules Button */}
				<div className='text-center'>
					<button
						onClick={() => setShowModal(true)}
						className='text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center justify-center mx-auto'
					>
						<span className='mr-2'>📜</span> View Rules
					</button>
				</div>
			</div>

			{/* Rules Modal */}
			{showModal && (
				<div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[100]'>
					<div className='bg-white rounded-2xl p-4 w-full max-w-md'>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='text-lg font-bold text-pink-600'>
								Treasure Hunter's Guide
							</h3>
							<button
								onClick={() => setShowModal(false)}
								className='text-gray-500 hover:text-gray-700'
							>
								✕
							</button>
						</div>
						<ol className='space-y-2 text-sm mb-4'>
							{[1, 2, 3, 4, 5].map((num) => (
								<li key={num} className='flex items-start'>
									<span className='bg-pink-100 text-pink-600 rounded-full w-5 h-5 flex items-center justify-center mr-2 font-bold text-xs'>
										{num}
									</span>
									<span className='text-pink-900'>
										{num === 1 &&
											'Read the riddle carefully and ponder its meaning.'}
										{num === 2 &&
											'Type your answer in the treasure chest.'}
										{num === 3 &&
											'Each treasure hunt challenge must be solved to proceed.'}
										{num === 4 &&
											'Correct answers will unlock the next clue in your journey.'}
										{num === 5 &&
											'The true treasure lies at the end of your quest!'}
									</span>
								</li>
							))}
						</ol>
						<button
							onClick={() => setShowModal(false)}
							className='w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-full text-sm font-bold'
						>
							Continue Adventure
						</button>
					</div>
				</div>
			)}

			{/* Error Popup */}
			{showError && (
				<div className='fixed bottom-6 right-6 shadow-lg animate-slide-in'>
					<div className='flex items-center bg-white border-l-4 border-red-500 p-4 rounded-lg max-w-xs space-x-3 transform transition-all duration-300 hover:scale-105'>
						<CircleX color='red' />
						<div>
							<p className='text-red-700 font-medium text-sm'>
								Incorrect answer! Try again.
							</p>
						</div>
						<button className='ml-4 text-gray-400 hover:text-gray-600 focus:outline-none'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-4 w-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M6 18L18 6M6 6l12 12'
								/>
							</svg>
						</button>
					</div>
				</div>
			)}

			{/* CSS Animations */}
			<style jsx>{`
				@keyframes gradientAnimation {
					0% {
						background-position: 0% 50%;
					}
					50% {
						background-position: 100% 50%;
					}
					100% {
						background-position: 0% 50%;
					}
				}

				@keyframes twinkle {
					0%,
					100% {
						opacity: 0.2;
						transform: scale(0.8);
					}
					50% {
						opacity: 1;
						transform: scale(1.2);
					}
				}
			`}</style>
		</div>
	);
};

export default TreasureHunt;
