import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({
	params,
	searchParams,
}: {
	params: { slug?: string[] };
	searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
	// Get the current path from params
	const path = params.slug ? params.slug.join('/') : 'Home';

	const formattedPath = path
		.split('/')
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(' ');

	return {
		title: `${formattedPath} | ACM BITS Pilani Hyderabad Campus`,
		description:
			'Association for Computing Machinery - BITS Pilani Hyderabad Campus, Student Chapter',
		icons: {
			icon: '/acm-logo.ico',
			apple: '/acm-logo.png',
		},
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={inter.className}>
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
