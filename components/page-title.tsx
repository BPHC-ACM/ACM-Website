'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function PageTitle() {
	const pathname = usePathname();

	useEffect(() => {
		const segment = pathname?.split('/')[1] || '';

		const title =
			segment === ''
				? 'Home'
				: segment.charAt(0).toUpperCase() + segment.slice(1);

		const fullTitle = `${title} | ACM BITS Pilani Hyderabad Campus`;

		document.title = fullTitle;
	}, [pathname]);

	return null;
}
