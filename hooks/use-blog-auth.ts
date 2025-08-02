'use client';

import { useState, useEffect } from 'react';

const AUTH_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export function useBlogAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		checkAuthentication();
	}, []);

	const checkAuthentication = () => {
		try {
			const authStatus = sessionStorage.getItem('blog_auth');
			const authTimestamp = sessionStorage.getItem('blog_auth_timestamp');

			if (authStatus === 'true' && authTimestamp) {
				const timestamp = parseInt(authTimestamp);
				const now = Date.now();

				// Check if authentication is still valid (within 30 minutes)
				if (now - timestamp < AUTH_DURATION) {
					setIsAuthenticated(true);
				} else {
					// Authentication expired, clear it
					clearAuthentication();
				}
			}
		} catch (error) {
			console.error('Error checking authentication:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const clearAuthentication = () => {
		try {
			sessionStorage.removeItem('blog_auth');
			sessionStorage.removeItem('blog_auth_timestamp');
			setIsAuthenticated(false);
		} catch (error) {
			console.error('Error clearing authentication:', error);
		}
	};

	const authenticate = () => {
		setIsAuthenticated(true);
	};

	return {
		isAuthenticated,
		isLoading,
		authenticate,
		clearAuthentication,
	};
}