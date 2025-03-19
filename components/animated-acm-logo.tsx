import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

const AnimatedACMLogo: React.FC = () => {
	const logoRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const imageContainerRef = useRef<HTMLDivElement>(null);
	const { theme, resolvedTheme } = useTheme();

	useEffect(() => {
		if (
			!canvasRef.current ||
			!logoRef.current ||
			!imageContainerRef.current
		)
			return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');
		const logoContainer = logoRef.current;
		const imageContainer = imageContainerRef.current;

		if (!ctx) return;

		const isDarkTheme = theme === 'dark' || resolvedTheme === 'dark';

		const updateSize = () => {
			const rect = logoContainer.getBoundingClientRect();
			canvas.width = rect.width;
			canvas.height = rect.height;
		};

		updateSize();
		window.addEventListener('resize', updateSize);

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const diamondSize = Math.min(canvas.width, canvas.height) * 0.5;

		const animationStartTime = Date.now();
		const scanDuration = 2000;
		const wipeDuration = 2000;
		const wipeDelay = 200;
		const holdDuration = 1500;
		const totalDuration =
			Math.max(scanDuration, wipeDuration + wipeDelay) + holdDuration;

		if (imageRef.current) {
			imageRef.current.style.opacity = '1';
		}

		function animate(): void {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			const now = Date.now();
			const elapsed = now - animationStartTime;

			const scanProgress = Math.min(elapsed / scanDuration, 1);
			const scanEndPoint = centerY + diamondSize * 0.9;
			const scanStartPoint = centerY - diamondSize;
			const scanDistance = scanEndPoint - scanStartPoint;
			const scanY = scanStartPoint + scanDistance * scanProgress;
			const scanHeight = 3;

			const wipeElapsed = Math.max(0, elapsed - wipeDelay);
			const wipeProgress = Math.min(wipeElapsed / wipeDuration, 1);

			if (imageContainer) {
				const clipHeight = wipeProgress * 100;
				imageContainer.style.clipPath = `inset(0 0 ${
					100 - clipHeight
				}% 0)`;
			}

			if (scanProgress < 1) {
				const scanLineColor = isDarkTheme
					? 'rgba(255, 255, 255, 0.7)'
					: 'rgba(91, 171, 216, 0.7)';

				ctx.fillStyle = scanLineColor;
				ctx.fillRect(
					centerX - diamondSize,
					scanY,
					diamondSize * 2,
					scanHeight
				);
			}

			const scanComplete = elapsed > scanDuration;
			const wipeComplete = elapsed > wipeDuration + wipeDelay;

			if (scanComplete && wipeComplete) {
				const time = now * 0.001;
				const glowSize = 5 + Math.sin(time * 2) * 2;

				const glowColor = isDarkTheme
					? 'rgba(255, 255, 255, 0.5)'
					: 'rgba(0, 120, 255, 0.5)';

				ctx.shadowBlur = glowSize;
				ctx.shadowColor = glowColor;

				ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
				ctx.lineWidth = 1;
				ctx.strokeRect(
					centerX - diamondSize,
					centerY - diamondSize,
					diamondSize * 2,
					diamondSize * 2
				);

				ctx.shadowBlur = 0;
			}

			if (elapsed < totalDuration) {
				requestAnimationFrame(animate);
			}
		}

		animate();

		return () => {
			window.removeEventListener('resize', updateSize);
		};
	}, [theme, resolvedTheme]);

	return (
		<div ref={logoRef} className='relative md:w-48 w-40 flex items-center'>
			<motion.div
				ref={imageContainerRef}
				className='relative z-10 overflow-hidden'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				<Image
					ref={imageRef as any}
					src='/acm-logo.png'
					alt='ACM Logo'
					width={256}
					height={256}
					className='object-contain'
					style={{ opacity: 0 }}
				/>
			</motion.div>
			<canvas
				ref={canvasRef}
				className='absolute top-0 left-0 w-full h-full z-20 pointer-events-none'
			/>
		</div>
	);
};

export default AnimatedACMLogo;
