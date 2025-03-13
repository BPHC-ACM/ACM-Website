'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPaginationProps {
	currentPage: number;
	totalPages: number;
	category?: string;
	onPageChange: (page: number) => void;
}

export default function BlogPagination({
	currentPage,
	totalPages,
	onPageChange,
}: BlogPaginationProps) {
	const getPageNumbers = () => {
		const pages = [];
		const maxPagesToShow = 5;

		if (totalPages <= maxPagesToShow) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			pages.push(1);

			let start = Math.max(2, currentPage - 1);
			let end = Math.min(totalPages - 1, currentPage + 1);

			if (currentPage <= 2) {
				end = Math.min(totalPages - 1, 4);
			}

			if (currentPage >= totalPages - 1) {
				start = Math.max(2, totalPages - 3);
			}

			if (start > 2) {
				pages.push('ellipsis-start');
			}

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (end < totalPages - 1) {
				pages.push('ellipsis-end');
			}

			pages.push(totalPages);
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className='flex items-center justify-center'>
			<div className='flex items-center space-x-2'>
				<Button
					variant='outline'
					size='icon'
					disabled={currentPage === 1}
					onClick={() =>
						currentPage !== 1 && onPageChange(currentPage - 1)
					}
				>
					<span className='sr-only'>Previous page</span>
					<ChevronLeft className='h-4 w-4' />
				</Button>

				{pageNumbers.map((page, index) => {
					if (page === 'ellipsis-start' || page === 'ellipsis-end') {
						return (
							<span key={`ellipsis-${index}`} className='px-2'>
								...
							</span>
						);
					}

					const pageNum = page as number;

					return (
						<Button
							key={`page-${page}`}
							variant={
								currentPage === pageNum ? 'default' : 'outline'
							}
							size='sm'
							className='h-8 w-8 p-0'
							onClick={() =>
								currentPage !== pageNum && onPageChange(pageNum)
							}
						>
							{pageNum}
						</Button>
					);
				})}

				<Button
					variant='outline'
					size='icon'
					disabled={currentPage === totalPages}
					onClick={() =>
						currentPage !== totalPages &&
						onPageChange(currentPage + 1)
					}
				>
					<span className='sr-only'>Next page</span>
					<ChevronRight className='h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
