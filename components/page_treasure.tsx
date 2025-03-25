'use client';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import TreasureHunt from '@/app/events/treasurehunt'; // Assuming the path is correct

const AnimatedPlayButton = () => {
	const [timeRemaining, setTimeRemaining] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [timerComplete, setTimerComplete] = useState(false);

	useEffect(() => {
		const targetDate = new Date('March 27, 2025 00:00:00').getTime();

		const updateCountdown = () => {
			const now = new Date().getTime();
			const difference = targetDate - now;

			if (difference <= 0) {
				setTimerComplete(true);
				return;
			}

			const days = Math.floor(difference / (1000 * 60 * 60 * 24));
			const hours = Math.floor(
				(difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
			);
			const minutes = Math.floor(
				(difference % (1000 * 60 * 60)) / (1000 * 60)
			);
			const seconds = Math.floor((difference % (1000 * 60)) / 1000);

			setTimeRemaining({ days, hours, minutes, seconds });
		};

		// Initial update
		updateCountdown();

		// Update every second
		const interval = setInterval(updateCountdown, 1000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className='flex justify-center items-center w-full m-auto'>
			{!timerComplete ? (
				<div className='w-[40rem] max-w-full p-4'>
					<div
						className='flex flex-col items-center justify-center p-6 rounded-lg 
						bg-white/90 backdrop-blur-sm 
						border border-pink-100
						shadow-xl
						max-w-md mx-auto'
					>
						<div className='relative mb-3'>
							<div className='absolute inset-0 bg-pink-300 rounded-full animate-ping opacity-75'></div>
							<Clock
								className='text-pink-300 relative z-10'
								size={32}
							/>
						</div>
						<h3 className='text-xl font-bold text-gray-800 mb-4 tracking-wider text-center'>
							PEARL Treasure Hunt
						</h3>

						<div className='grid grid-cols-4 gap-2 w-full mb-4'>
							{['days', 'hours', 'minutes', 'seconds'].map(
								(unit) => (
									<div
										key={unit}
										className='flex flex-col items-center'
									>
										<div
											className='
											bg-pink-100 
											text-pink-800 
											text-2xl font-bold 
											rounded-lg w-full py-3 text-center
											shadow-sm
											transition-all duration-300 ease-in-out
											transform hover:scale-105
										'
										>
											{
												timeRemaining[
													unit as keyof typeof timeRemaining
												]
											}
										</div>
										<span
											className='
											text-pink-600 
											text-xs mt-1 
											uppercase tracking-wider
										'
										>
											{unit}
										</span>
									</div>
								)
							)}
						</div>

						<p
							className='
								text-pink-700 
								text-sm text-center 
								italic 
								transition-colors duration-300
							'
						>
							Get ready for an exciting adventure!
						</p>
					</div>
				</div>
			) : (
				<TreasureHunt />
			)}
		</div>
	);
};

export default AnimatedPlayButton;
