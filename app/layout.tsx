import type React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import PageTitle from '@/components/page-title';
import GoogleAnalytics from '@/components/google-analytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	description:
		'Association for Computing Machinery - BITS Pilani, Hyderabad Campus, Student Chapter',
	icons: {
		icon: '/acm-logo.ico',
		apple: '/acm-logo.png',
	},
	openGraph: {
		title: 'ACM BPHC',
		description:
			'Association for Computing Machinery - BITS Pilani, Hyderabad Campus, Student Chapter',
		images: [
			{
				url: '/og-image.png',
				width: 1200,
				height: 630,
				alt: 'ACM BPHC OG Image',
			},
		],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'ACM BPHC',
		description:
			'Association for Computing Machinery - BITS Pilani, Hyderabad Campus, Student Chapter',
		images: ['/og-image.png'],
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
				<GoogleAnalytics />
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
