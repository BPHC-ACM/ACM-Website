'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { motion } from 'framer-motion';

const navItems = [
	{ name: 'Home', href: '/' },
	{ name: 'Events', href: '/events' },
	{ name: 'Blogs', href: '/blogs' },
	{ name: 'Team', href: '/team' },
];

export default function Navbar() {
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header className='sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md'>
			<div className='container flex h-16 items-center justify-between'>
				<div className='flex items-center gap-6'>
					<Link href='/' className='flex items-center'>
						<motion.div
							className='relative'
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							<Image
								src='/bits-acm-logo.png'
								alt='BITS Pilani ACM Student Chapter Logo'
								width={96}
								height={96}
								className='object-contain'
								style={{ width: 96, height: 96 }}
							/>
						</motion.div>
					</Link>
					<nav className='hidden md:flex md:gap-6'>
						{navItems.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									'text-sm font-medium transition-colors hover:text-primary relative',
									pathname === item.href
										? 'text-primary'
										: 'text-muted-foreground'
								)}
							>
								{item.name}
								{pathname === item.href && (
									<motion.span
										className='absolute -bottom-1 left-0 h-0.5 w-full bg-primary'
										layoutId='navbar-indicator'
										transition={{
											type: 'spring',
											stiffness: 350,
											damping: 30,
										}}
									/>
								)}
							</Link>
						))}
					</nav>
				</div>
				<div className='flex items-center gap-4'>
					<ModeToggle />
					<motion.div
						className='relative'
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3 }}
					>
						<Image
							src='/bits-logo.png'
							alt='BITS Pilani Logo'
							width={40}
							height={40}
							className='object-contain'
						/>
					</motion.div>
					<button
						className='md:hidden'
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						aria-label='Toggle menu'
					>
						{mobileMenuOpen ? (
							<X className='h-6 w-6' />
						) : (
							<Menu className='h-6 w-6' />
						)}
					</button>
				</div>
			</div>
			{mobileMenuOpen && (
				<motion.div
					className='container md:hidden'
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.3 }}
				>
					<nav className='flex flex-col space-y-4 py-4'>
						{navItems.map((item) => (
							<Link
								prefetch={true}
								key={item.name}
								href={item.href}
								className={cn(
									'text-sm font-medium transition-colors hover:text-primary',
									pathname === item.href
										? 'text-primary'
										: 'text-muted-foreground'
								)}
								onClick={() => setMobileMenuOpen(false)}
							>
								{item.name}
							</Link>
						))}
					</nav>
				</motion.div>
			)}
		</header>
	);
}
