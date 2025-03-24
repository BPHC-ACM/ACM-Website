import type React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import PageTitle from '@/components/page-title';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	description:
		'Association for Computing Machinery - BITS Pilani Hyderabad Campus, Student Chapter',
	icons: {
		icon: '/acm-logo.ico',
		apple: '/acm-logo.png',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={inter.className}>
				<PageTitle />
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					enableSystem
					disableTransitionOnChange
				>
					<div className='flex min-h-screen flex-col bg-background'>
						<Navbar />
						<main className='flex-1'>{children}</main>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}

import './globals.css';
