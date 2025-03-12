'use client';

import { useEffect } from 'react';

export function useSmoothScroll() {
	useEffect(() => {
		const handleAnchorClick = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			const anchor = target.closest('a');

			if (!anchor) return;

			const href = anchor.getAttribute('href');
			if (!href?.startsWith('#')) return;

			e.preventDefault();
			const targetId = href.substring(1);
			const targetElement = document.getElementById(targetId);

			if (targetElement) {
				window.scrollTo({
					top: targetElement.offsetTop,
					behavior: 'smooth',
				});

				window.history.pushState(null, '', href);
			}
		};

		document.addEventListener('click', handleAnchorClick);

		return () => {
			document.removeEventListener('click', handleAnchorClick);
		};
	}, []);
}
