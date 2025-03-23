'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import AnimatedTechBackground from '@/components/animated-tech-background';
import BlogPagination from './blog-pagination';

interface BlogPost {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	featured_image: string;
	created_at: string;
	category_name: string;
	category_slug: string;
	author_name?: string | null;
}

interface Pagination {
	page: number;
	totalPages: number;
	total?: number;
	pageSize?: number;
}

export default function BlogPage() {
	return (
		<Suspense
			fallback={
				<div className='flex justify-center py-10'>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
				</div>
			}
		>
			<BlogPageContent />
		</Suspense>
	);
}

function BlogPageContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const initialPage = Number(searchParams.get('page') || '1');
	const initialCategory = searchParams.get('category') || 'All';
	const initialSearch = searchParams.get('search') || '';

	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [categories, setCategories] = useState<
		{ name: string; slug: string }[]
	>([]);
	const [pagination, setPagination] = useState<Pagination>({
		page: initialPage,
		totalPages: 1,
		total: 0,
	});
	const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
	const [loading, setLoading] = useState<boolean>(true);
	const [debounceTimeout, setDebounceTimeout] =
		useState<NodeJS.Timeout | null>(null);
	const [hasSearched, setHasSearched] = useState<boolean>(false);

	// Combined fetch function for both categories and posts
	const fetchData = async (
		pageNum: number,
		categoryName: string,
		search: string = ''
	) => {
		setLoading(true);
		try {
			// Fetch categories if needed
			if (categories.length === 0) {
				const categoriesResponse = await fetch('/api/blogs/categories');
				if (categoriesResponse.ok) {
					const categoriesData = await categoriesResponse.json();
					setCategories(categoriesData || []);
				}
			}

			// Build URL for posts
			let url = `/api/blogs?page=${pageNum}`;
			if (categoryName !== 'All') {
				const categoryObj = categories.find(
					(c) => c.name === categoryName
				);
				const categorySlug =
					categoryObj?.slug ||
					categoryName.toLowerCase().replace(/\s+/g, '-');
				url += `&category=${categorySlug}`;
			}
			if (search) url += `&search=${encodeURIComponent(search)}`;

			// Set hasSearched if user is searching or filtering
			setHasSearched(search !== '' || categoryName !== 'All');

			// Fetch posts
			const postsResponse = await fetch(url);
			if (postsResponse.ok) {
				const data = await postsResponse.json();
				setPosts(data.posts || []);
				setPagination({
					page: data.pagination?.page || 1,
					totalPages: data.pagination?.totalPages || 1,
					total: data.pagination?.total || 0,
				});
			}
		} catch (error) {
			console.error('Error fetching data:', error);
		} finally {
			setLoading(false);
		}
	};

	// Effect to fetch data when URL params change
	useEffect(() => {
		const pageNum = Number(searchParams.get('page') || '1');
		const categoryName = searchParams.get('category') || 'All';
		const search = searchParams.get('search') || '';

		setSearchTerm(search);
		fetchData(pageNum, categoryName, search);
	}, [searchParams]);

	// Handle category selection
	const handleCategoryChange = (categoryName: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', '1');

		if (categoryName !== 'All') {
			params.set('category', categoryName);
		} else {
			params.delete('category');
		}

		if (searchTerm) {
			params.set('search', searchTerm);
		}

		router.push(`/blogs?${params.toString()}`);
	};

	// Handle pagination
	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', newPage.toString());
		router.push(`/blogs?${params.toString()}`);
	};

	// Handle search with debouncing
	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchTerm = e.target.value;
		setSearchTerm(newSearchTerm);

		// Clear existing timeout
		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		// Set new timeout for search
		const timeout = setTimeout(() => {
			const params = new URLSearchParams(searchParams.toString());
			params.set('page', '1');

			if (newSearchTerm) {
				params.set('search', newSearchTerm);
			} else {
				params.delete('search');
			}

			router.push(`/blogs?${params.toString()}`);
		}, 500); // 500ms debounce

		setDebounceTimeout(timeout);
	};

	// Clean up timeout on unmount
	useEffect(() => {
		return () => {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
		};
	}, [debounceTimeout]);

	return (
		<div className='flex flex-col'>
			{/* Hero Section */}
			<section className='bg-card py-10 md:py-16 lg:py-24'>
				<AnimatedTechBackground />
				<div className='container'>
					<div className='mx-auto max-w-3xl text-center'>
						<h1 className='mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl'>
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
					{/* Search */}
					<div className='relative w-full max-w-full mb-6 md:mb-10'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							type='search'
							placeholder='Search articles...'
							className='pl-10'
							value={searchTerm}
							onChange={handleSearch}
						/>
					</div>

					{/* If total blog count is 0, show either "Coming soon" or "No posts found" */}
					{pagination.total === 0 ? (
						!loading ? (
							hasSearched ? (
								<div className='rounded-lg border border-dashed p-10 text-center'>
									<h3 className='mb-2 text-xl font-semibold'>
										No Blog Posts Found
									</h3>
									<p className='mb-6 text-muted-foreground'>
										{searchTerm
											? `No results match "${searchTerm}". Try different keywords or browse by category.`
											: 'There are no blog posts in this category yet. Check back soon!'}
									</p>
									{(searchTerm ||
										searchParams.get('category')) && (
										<Button
											variant='outline'
											onClick={() => {
												router.push('/blogs');
												setSearchTerm('');
											}}
										>
											Reset Filters
										</Button>
									)}
								</div>
							) : (
								<div className='flex flex-col items-center justify-center py-20'>
									<h2 className='text-3xl font-bold mb-4'>
										Coming Soon
									</h2>
									<p className='text-muted-foreground text-center max-w-lg'>
										We're working on creating amazing blog
										content for you. Check back soon for
										insightful articles and updates!
									</p>
								</div>
							)
						) : (
							<div className='flex justify-center py-10'>
								<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
							</div>
						)
					) : (
						<>
							{/* Categories */}
							<div
								className='flex overflow-x-auto pb-2 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:gap-2 md:mb-10'
								style={{
									msOverflowStyle: 'none',
									scrollbarWidth: 'none',
								}}
							>
								{/* For WebKit browsers (Chrome, Safari) */}
								<style jsx>{`
									div::-webkit-scrollbar {
										display: none;
									}
								`}</style>

								<Button
									key='all'
									variant={
										searchParams.get('category') === null
											? 'default'
											: 'outline'
									}
									size='sm'
									onClick={() => handleCategoryChange('All')}
									className='flex-shrink-0 mr-2 md:mr-0'
								>
									All
								</Button>
								{categories.map((cat, index) => (
									<Button
										key={index}
										variant={
											searchParams.get('category') ===
											cat.name
												? 'default'
												: 'outline'
										}
										size='sm'
										onClick={() =>
											handleCategoryChange(cat.name)
										}
										className='flex-shrink-0 mr-2 md:mr-0'
									>
										{cat.name}
									</Button>
								))}
							</div>

							{/* Blog Posts Grid */}
							{!loading && posts.length > 0 ? (
								<div className='grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
									{posts.map((post) => (
										<Card
											key={post.id}
											className='overflow-hidden transition-all hover:shadow-lg flex flex-col'
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
													priority={false}
												/>
											</div>
											<CardContent className='p-4 sm:p-6 flex flex-col flex-1'>
												<div className='flex-1'>
													<div className='mb-2 flex items-center gap-2'>
														<span className='rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary'>
															{post.category_name}
														</span>
														<span className='text-xs text-muted-foreground'>
															{new Date(
																post.created_at
															).toLocaleDateString(
																'en-US',
																{
																	day: 'numeric',
																	month: 'short',
																	year: 'numeric',
																}
															)}
														</span>
													</div>
													<h3 className='mb-2 text-lg sm:text-xl font-bold'>
														<Link
															href={`/blogs/${post.slug}`}
															className='hover:text-primary'
														>
															{post.title}
														</Link>
													</h3>
													<p className='mb-4 line-clamp-2 text-muted-foreground'>
														{post.excerpt}
													</p>
												</div>
												<div className='flex flex-wrap items-center justify-between gap-2 h-auto sm:h-10 border-t pt-2'>
													<span className='text-sm text-muted-foreground truncate max-w-[180px] sm:max-w-none'>
														By{' '}
														{post.author_name ||
															'Unknown Author'}
													</span>
													<Button
														asChild
														variant='ghost'
														size='sm'
													>
														<Link
															href={`/blogs/${post.slug}`}
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
										There are no blog posts in this category
										yet. Check back soon!
									</p>
								</div>
							) : (
								<div className='flex justify-center py-10'>
									<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
								</div>
							)}

							{pagination &&
								pagination.totalPages > 1 &&
								!loading && (
									<div className='mt-10'>
										<BlogPagination
											currentPage={pagination.page}
											totalPages={pagination.totalPages}
											category={
												searchParams.get('category') ||
												'All'
											}
											onPageChange={handlePageChange}
										/>
									</div>
								)}
						</>
					)}
				</div>
			</section>
		</div>
	);
}
