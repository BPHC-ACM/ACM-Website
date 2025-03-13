'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';

export default function ShareButton() {
	const [showToast, setShowToast] = useState(false);

	const handleShare = () => {
		navigator.clipboard.writeText(window.location.href);
		setShowToast(true);

		setTimeout(() => {
			setShowToast(false);
		}, 1500);
	};

	return (
		<div className='relative'>
			<button
				onClick={handleShare}
				className='p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-primary transition-all'
				title='Share article'
			>
				<Share2 className='h-4 w-4' />
			</button>

			{showToast && (
				<div className='fixed bottom-2 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-md whitespace-nowrap animate-fade-in-up'>
					Link copied to clipboard
				</div>
			)}

			{/* Add animation keyframes */}
			<style jsx global>{`
				@keyframes fadeInUp {
					from {
						opacity: 0;
						transform: translate(-50%, 20px);
					}
					to {
						opacity: 1;
						transform: translate(-50%, 0);
					}
				}

				@keyframes fadeOut {
					from {
						opacity: 1;
					}
					to {
						opacity: 0;
					}
				}

				.animate-fade-in-up {
					animation: fadeInUp 0.3s ease-out forwards,
						fadeOut 0.3s ease-in forwards 2.7s;
				}
			`}</style>
		</div>
	);
}
