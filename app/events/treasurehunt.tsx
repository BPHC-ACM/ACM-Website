'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { CircleX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TreasureHunt: React.FC = () => {
	const [answer, setAnswer] = useState('');
	const [showModal, setShowModal] = useState(false);
	const [showError, setShowError] = useState(false);
	const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });

	const rules = [
		'Only use capital letters without any other punctuation.',
		'Do not use spaces, write the answer as a continuous string.',
		'Do not use abbreviations, specify the full form of the phrase in accordance with the above rule.',
		'If the common phrasing of the answer is used in plural form, follow the same, in accordance with above rules.',
		"E.g. 'Dorm' is 'DORMITORIES', 'atm' is 'AUTOMATEDTELLINGMACHINE'",
	];

	// The correct answer to the riddle
	const correctAnswer = 'newfootballground';

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
			window.open('https://drive.google.com/drive/folders/1CMaJ-eqdVmbEL02V7BZTt3CZYFmSXPKK', '_blank');
		} else {
			// Show error popup
			setShowError(true);
			setTimeout(() => setShowError(false), 3000); // Hide after 3 seconds
		}
	};

	return (
		<div
			className='md:w-[28rem] w-[20rem] md:-mt-32 -mt-16 mb-12 rounded-2xl h-[29rem] mx-auto flex flex-col items-center justify-center md:p-6 p-4 font-sans relative overflow-hidden'
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
			<motion.div
				className='w-full max-w-md bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm rounded-xl shadow-2xl p-4 z-10 border border-pink-200'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
			>
				{/* Logo */}
				<motion.div
					className='flex justify-center mb-4'
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.2 }}
				>
					<div className='w-16 h-16 bg-yellow-400 rounded-full shadow-xl overflow-hidden border-4 border-pink-300'>
						<img
							src='/pearl-logo.png?height=64&width=64'
							alt='Pearl Logo'
							className='w-full h-full object-cover rounded-full'
						/>
					</div>
				</motion.div>

				{/* Title */}
				<motion.div
					className='text-center mb-4'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<h1 className='text-2xl font-bold text-gray-800 uppercase tracking-wider'>
						Hunt for the Sun
					</h1>
					<div className='h-1 w-20 bg-yellow-400 mx-auto mt-2 rounded-full'></div>
				</motion.div>

				{/* Riddle Section */}
				<motion.div
					className='mb-4 text-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<div className='inline-block bg-pink-600 text-white px-3 py-1 rounded-full font-bold mb-2 text-xs'>
						Riddle #1
					</div>
					<p className='text-gray-700 italic text-sm leading-relaxed'>
						Multipurpose is my use, on me people kick, run, and
						catch; I provide many goals, year round do they love to
						match!
					</p>
				</motion.div>

				{/* Answer Form */}
				<motion.form
					onSubmit={handleSubmit}
					className='mb-4'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
				>
					<motion.input
						type='text'
						value={answer}
						onChange={(e) => setAnswer(e.target.value)}
						placeholder='Enter your answer...'
						className='w-full px-3 py-2 rounded-full border-2 border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm mb-3'
						required
						whileFocus={{ scale: 1.02 }}
						transition={{ type: 'spring', stiffness: 300 }}
					/>
					<motion.button
						type='submit'
						className='w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-full text-sm font-bold hover:from-pink-600 hover:to-pink-700 transition-colors'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						Unlock Treasure
					</motion.button>
				</motion.form>

				{/* Rules Button */}
				<motion.div
					className='text-center'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6 }}
				>
					<motion.button
						onClick={() => setShowModal(true)}
						className='text-pink-600 hover:text-pink-700 font-medium text-sm flex items-center justify-center mx-auto'
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
					>
						<span className='mr-2'>📜</span> View Rules
					</motion.button>
				</motion.div>
			</motion.div>
			{/* Rules Modal */}
			{showModal && (
				<AnimatePresence>
					<motion.div
						className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[100]'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className='bg-white rounded-2xl p-4 w-full max-w-md'
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 20,
							}}
						>
							<div className='flex justify-between items-center mb-4'>
								<h3 className='text-lg font-bold text-pink-600'>
									Treasure Hunter's Guide
								</h3>
								<motion.button
									onClick={() => setShowModal(false)}
									className='text-gray-500 hover:text-gray-700'
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									✕
								</motion.button>
							</div>
							<motion.ol
								className='space-y-2 mb-4'
								initial='hidden'
								animate='visible'
								variants={{
									visible: {
										transition: {
											staggerChildren: 0.1,
										},
									},
								}}
							>
								{rules.map((rule, index) => (
									<motion.li
										key={index}
										className='flex items-start'
										variants={{
											hidden: { opacity: 0, x: -20 },
											visible: {
												opacity: 1,
												x: 0,
												transition: {
													type: 'spring',
													stiffness: 300,
													damping: 20,
												},
											},
										}}
									>
										<span className='bg-pink-100 text-pink-600 rounded-full w-6 h-6 flex items-center justify-center mr-4 font-bold text-xs'>
											{index + 1}
										</span>
										<span className='text-pink-900 flex-1'>
											{rule}
										</span>
									</motion.li>
								))}
							</motion.ol>
							<motion.button
								onClick={() => setShowModal(false)}
								className='w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 rounded-full text-sm font-bold'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Continue Adventure
							</motion.button>
						</motion.div>
					</motion.div>
				</AnimatePresence>
			)}
			{/* Error Popup */}
			{showError && (
				<div className='fixed bottom-6 z-[20] right-6 shadow-lg animate-slide-in'>
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
