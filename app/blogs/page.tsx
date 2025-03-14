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
	totalItems?: number;
	itemsPerPage?: number;
	total?: number;
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
	const initialPage = searchParams.get('page')
		? Number(searchParams.get('page'))
		: 1;
	const initialCategory = searchParams.get('category') || 'All';

	const [selectedCategory, setSelectedCategory] =
		useState<string>(initialCategory);
	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
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
	const [totalBlogCount, setTotalBlogCount] = useState<number>(0);

	const fetchCategories = async () => {
		try {
			const response = await fetch('/api/blogs/categories');
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

	const fetchBlogPosts = async (
		pageNum: number,
		categoryName: string,
		search: string = ''
	) => {
		setLoading(true);
		try {
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

			const response = await fetch(url);

			if (!response.ok) {
				throw new Error('Failed to fetch blog posts');
			}

			const data = await response.json();
			const fetchedPosts = data.posts || [];
			setPosts(fetchedPosts);
			setAllPosts(fetchedPosts);
			setPagination(data.pagination || { page: 1, totalPages: 1 });
			setTotalBlogCount(data.pagination?.total || 0);
		} catch (error) {
			console.error('Error fetching posts:', error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			if (categories.length === 0) {
				const categoriesData = await fetchCategories();
				setCategories(categoriesData);
			}

			const currentPage = searchParams.get('page')
				? Number(searchParams.get('page'))
				: 1;
			const currentCategory = searchParams.get('category') || 'All';
			const currentSearch = searchParams.get('search') || '';

			if (currentPage === 1 && !currentSearch) {
				const allPostsResponse = await fetch(`/api/blogs?page=1`);
				if (allPostsResponse.ok) {
					const allPostsData = await allPostsResponse.json();
					setAllPosts(allPostsData.posts || []);
				}
			}

			setPage(currentPage);
			setSelectedCategory(currentCategory);
			if (currentSearch) setSearchTerm(currentSearch);

			await fetchBlogPosts(currentPage, currentCategory, currentSearch);
		};

		fetchData();
	}, [searchParams]);

	const handleCategoryChange = (categoryName: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', '1');

		if (categoryName !== 'All') {
			params.set('category', categoryName);
		} else {
			params.delete('category');
		}

		router.push(`/blogs?${params.toString()}`);
	};

	const handlePageChange = (newPage: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', newPage.toString());

		router.push(`/blogs?${params.toString()}`);
	};

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchTerm = e.target.value;
		setSearchTerm(newSearchTerm);

		if (newSearchTerm === '') {
			setPosts(allPosts);
			return;
		}

		const filteredPosts = allPosts.filter(
			(post) =>
				post.title
					.toLowerCase()
					.includes(newSearchTerm.toLowerCase()) ||
				post.excerpt
					.toLowerCase()
					.includes(newSearchTerm.toLowerCase()) ||
				post.category_name
					.toLowerCase()
					.includes(newSearchTerm.toLowerCase())
		);
		setPosts(filteredPosts);
	};

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

					{/* If total blog count is 0, show "Coming soon" */}
					{totalBlogCount === 0 ? (
						!loading ? (
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
										selectedCategory === 'All'
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
											selectedCategory === cat.name
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
															prefetch={true}
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
															prefetch={true}
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
											category={selectedCategory}
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
