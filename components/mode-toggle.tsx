'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import React from 'react';

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	// Toggle between light and dark theme
	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

	// Set to system theme initially (as default)
	React.useEffect(() => {
		if (!theme) {
			setTheme('system');
		}
	}, [theme, setTheme]);

	return (
		<Button
			variant='outline'
			size='icon'
			onClick={toggleTheme}
			className='h-9 w-9'
		>
			<Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
			<Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
			<span className='sr-only'>Toggle theme</span>
		</Button>
	);
}
