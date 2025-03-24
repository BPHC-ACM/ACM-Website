'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface RollingTextProps {
	children: string;
	className?: string;
	delay?: number;
	staggerTime?: number;
}

const RollingText: React.FC<RollingTextProps> = ({
	children,
	className = '',
	delay = 0,
	staggerTime = 0.05,
}) => {
	const characters = Array.from(children.toString());

	const container = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: staggerTime,
				delayChildren: staggerTime + delay,
			},
		},
	};

	const child = {
		hidden: {
			opacity: 0,
			y: 20,
			transition: {
				type: 'spring',
				damping: 12,
				stiffness: 100,
			},
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: 'spring',
				damping: 12,
				stiffness: 100,
			},
		},
	};

	return (
		<motion.span
			className={`inline-block ${className}`}
			variants={container}
			initial='hidden'
			animate='visible'
		>
			{characters.map((char, index) => (
				<motion.span
					key={index}
					variants={child}
					className='inline-block leading-relaxed overflow-visible h-auto'
				>
					{char === ' ' ? '\u00A0' : char}
				</motion.span>
			))}
		</motion.span>
	);
};

export default RollingText;
