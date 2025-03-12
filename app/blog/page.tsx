'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import AnimatedTechBackground from '@/components/animated-tech-background';
import BlogPagination from './blog-pagination';

// Define types for the data
interface Author {
	id: string;
	name: string;
	avatar_url?: string;
}

interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	featured_image: string;
	created_at: string;
	category_name: string;
	category_slug: string;
	author_id: string;
	author?: Author | null;
}

interface Pagination {
	page: number;
	totalPages: number;
	totalItems?: number;
	itemsPerPage?: number;
}

export default function BlogPage() {
	const searchParams = useSearchParams();
	const initialPage = searchParams.get('page')
		? Number(searchParams.get('page'))
		: 1;
	const initialCategory = searchParams.get('category') || 'All';

	const [selectedCategory, setSelectedCategory] =
		useState<string>(initialCategory);
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [categories, setCategories] = useState<
		{ name: string; slug: string }[]
	>([]);
	const [pagination, setPagination] = useState<Pagination>({
		page: initialPage,
		totalPages: 1,
	});
	const [page, setPage] = useState<number>(initialPage);
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);

	// Function to fetch categories from API
	const fetchCategories = async () => {
		try {
			const response = await fetch('/api/blog/categories');
			if (!response.ok) {
				throw new Error('Failed to fetch categories');
			}
			const data = await response.json();
			return data || [];
		} catch (error) {
			console.error('Error fetching categories:', error);
			return [];
		}
	};

	// Function to fetch blog posts from API
	const fetchBlogPosts = async (
		pageNum: number,
		categoryName: string,
		search: string = ''
	) => {
		setLoading(true);
		try {
			let url = `/api/blog?page=${pageNum}`;

			// Use category slug instead of name if not "All"
			if (categoryName !== 'All') {
				const categorySlug =
					categories.find((c) => c.name === categoryName)?.slug ||
					categoryName.toLowerCase().replace(/\s+/g, '-');
				url += `&category=${categorySlug}`;
			}

			if (search) url += `&search=${encodeURIComponent(search)}`;

			const response = await fetch(url);

			if (!response.ok) {
				throw new Error('Failed to fetch blog posts');
			}

			const data = await response.json();
			setPosts(data.posts || []);
			setPagination(data.pagination || { page: 1, totalPages: 1 });
		} catch (error) {
			console.error('Error fetching posts:', error);
		} finally {
			setLoading(false);
		}
	};

	// Fetch data on initial load
	useEffect(() => {
		const fetchInitialData = async () => {
			setLoading(true);
			try {
				// Fetch categories
				const categoriesData = await fetchCategories();
				setCategories(categoriesData);

				// Fetch initial posts
				await fetchBlogPosts(initialPage, initialCategory);
			} catch (error) {
				console.error('Error fetching initial data:', error);
			}
		};

		fetchInitialData();
	}, [initialPage, initialCategory]);

	// Handle category selection
	const handleCategoryChange = (categoryName: string) => {
		setSelectedCategory(categoryName);
		setPage(1); // Reset to first page when changing categories
		fetchBlogPosts(1, categoryName, searchTerm);
	};

	// Handle page change
	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		fetchBlogPosts(newPage, selectedCategory, searchTerm);
	};

	// Handle search
	const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			fetchBlogPosts(1, selectedCategory, searchTerm);
			setPage(1); // Reset to first page when searching
		}
	};

	return (
		<div className='flex flex-col'>
			{/* Hero Section */}
			<section className='bg-card py-16 md:py-24'>
				<AnimatedTechBackground />
				<div className='container'>
					<div className='mx-auto max-w-3xl text-center'>
						<h1 className='mb-6 text-4xl font-bold tracking-tight md:text-5xl'>
							<span className='heading-gradient'>ACM Blog</span>
						</h1>
						<p className='mb-0 text-lg text-muted-foreground md:text-xl'>
							Insights, tutorials, and updates from our community.
						</p>
					</div>
				</div>
			</section>

			{/* Blog Content Section */}
			<section className='section-padding z-10'>
				<div className='container'>
					<div className='mb-10 flex flex-col gap-6 w-full md:items-center md:justify-between'>
						{/* Search */}
						<div className='relative w-full'>
							<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Search articles...'
								className='pl-10'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								onKeyDown={handleSearch}
							/>
						</div>
						{/* Categories */}
						<div className='flex flex-wrap center gap-2'>
							<Button
								key='all'
								variant={
									selectedCategory === 'All'
										? 'default'
										: 'outline'
								}
								size='sm'
								onClick={() => handleCategoryChange('All')}
							>
								All
							</Button>
							{categories.map((cat, index) => (
								<Button
									key={index}
									variant={
										selectedCategory === cat.name
											? 'default'
											: 'outline'
									}
									size='sm'
									onClick={() =>
										handleCategoryChange(cat.name)
									}
								>
									{cat.name}
								</Button>
							))}
						</div>
					</div>

					{/* Loading state */}
					{loading && (
						<div className='flex justify-center py-10'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
						</div>
					)}

					{/* Blog Posts Grid */}
					{!loading && posts.length > 0 ? (
						<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
							{posts.map((post) => (
								<Card
									key={post.id}
									className='overflow-hidden transition-all hover:shadow-lg'
								>
									<div className='aspect-video relative'>
										<Image
											src={
												post.featured_image ||
												'/placeholder.svg?height=200&width=400'
											}
											alt={post.title}
											fill
											className='object-cover'
										/>
									</div>
									<CardContent className='p-6'>
										<div className='mb-2 flex items-center gap-2'>
											<span className='rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary'>
												{post.category_name}
											</span>
											<span className='text-xs text-muted-foreground'>
												{new Date(
													post.created_at
												).toLocaleDateString('en-US', {
													day: 'numeric',
													month: 'short',
													year: 'numeric',
												})}
											</span>
										</div>
										<h3 className='mb-2 text-xl font-bold'>
											<Link
												href={`/blog/${post.slug}`}
												className='hover:text-primary'
											>
												{post.title}
											</Link>
										</h3>
										<p className='mb-4 line-clamp-2 text-muted-foreground'>
											{post.excerpt}
										</p>
										<div className='flex items-center justify-between'>
											<span className='text-sm text-muted-foreground'>
												By{' '}
												{post.author?.name ||
													'Unknown Author'}
											</span>
											<Button
												asChild
												variant='ghost'
												size='sm'
											>
												<Link
													href={`/blog/${post.slug}`}
												>
													Read More
												</Link>
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					) : !loading ? (
						<div className='rounded-lg border border-dashed p-10 text-center'>
							<h3 className='mb-2 text-xl font-semibold'>
								No Blog Posts Found
							</h3>
							<p className='mb-6 text-muted-foreground'>
								There are no blog posts in this category yet.
								Check back soon!
							</p>
						</div>
					) : null}

					{/* Pagination */}
					{pagination && pagination.totalPages > 1 && !loading && (
						<div className='mt-10'>
							<BlogPagination
								currentPage={pagination.page}
								totalPages={pagination.totalPages}
								category={selectedCategory}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
