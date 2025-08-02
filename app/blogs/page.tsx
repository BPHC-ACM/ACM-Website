'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import AnimatedTechBackground from '@/components/animated-tech-background';
import BlogPagination from './blog-pagination';
import { useToast } from '@/hooks/use-toast';
import PasswordDialog from '@/components/password-dialog';
import { useBlogAuth } from '@/hooks/use-blog-auth';

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
	published: boolean;
}

interface Category {
	name: string;
	slug: string;
}

interface Pagination {
	page: number;
	totalPages: number;
	total?: number;
	pageSize?: number;
}

export default function BlogPage() {
	return (
		<Suspense fallback={<BlogLoadingSkeleton />}>
			<BlogPageContent />
		</Suspense>
	);
}

function BlogLoadingSkeleton() {
	return (
		<div className='flex justify-center py-10'>
			<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
		</div>
	);
}

function BlogPageContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { toast } = useToast();
	const { isAuthenticated, authenticate } = useBlogAuth();
	const [showPasswordDialog, setShowPasswordDialog] = useState(false);
	const [pendingAction, setPendingAction] = useState<'create' | 'edit' | 'delete' | null>(null);
	const [pendingBlogData, setPendingBlogData] = useState<{ id: string; title: string } | null>(null);

	const [posts, setPosts] = useState<BlogPost[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [pagination, setPagination] = useState<Pagination>({
		page: 1,
		totalPages: 1,
		total: 0,
	});
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(true);
	const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
	const [debounceTimeout, setDebounceTimeout] =
		useState<NodeJS.Timeout | null>(null);

	const handleDeleteBlog = async (blogId: string, blogTitle: string) => {
		if (!isAuthenticated) {
			setPendingAction('delete');
			setPendingBlogData({ id: blogId, title: blogTitle });
			setShowPasswordDialog(true);
			return;
		}

		await performDeleteBlog(blogId, blogTitle);
	};

	const performDeleteBlog = async (blogId: string, blogTitle: string) => {
		if (!confirm(`Are you sure you want to delete "${blogTitle}"?`)) {
			return;
		}

		try {
			const response = await fetch(`/api/blogs/manage/${blogId}`, {
				method: 'DELETE',
			});

			if (response.ok) {
				toast({
					title: 'Success',
					description: 'Blog post deleted successfully',
				});
				// Refresh the page to update the blog list
				window.location.reload();
			} else {
				toast({
					title: 'Error',
					description: 'Failed to delete blog post',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Error deleting blog:', error);
			toast({
				title: 'Error',
				description: 'Failed to delete blog post',
				variant: 'destructive',
			});
		}
	};

	const handleCreateBlog = () => {
		if (!isAuthenticated) {
			setPendingAction('create');
			setShowPasswordDialog(true);
			return;
		}
		router.push('/blogs/create');
	};

	const handleEditBlog = (blogId: string) => {
		if (!isAuthenticated) {
			setPendingAction('edit');
			setPendingBlogData({ id: blogId, title: '' });
			setShowPasswordDialog(true);
			return;
		}
		router.push(`/blogs/create?edit=${blogId}`);
	};

	const handleAuthSuccess = () => {
		authenticate();
		
		// Execute pending action
		if (pendingAction === 'create') {
			router.push('/blogs/create');
		} else if (pendingAction === 'edit' && pendingBlogData) {
			router.push(`/blogs/create?edit=${pendingBlogData.id}`);
		} else if (pendingAction === 'delete' && pendingBlogData) {
			performDeleteBlog(pendingBlogData.id, pendingBlogData.title);
		}

		// Clear pending action
		setPendingAction(null);
		setPendingBlogData(null);
	};

	useEffect(() => {
		const fetchCategories = async () => {
			setCategoriesLoading(true);
			try {
				const categoriesResponse = await fetch('/api/blogs/categories');
				if (categoriesResponse.ok) {
					const categoriesData: Category[] =
						await categoriesResponse.json();
					setCategories(categoriesData || []);
				} else {
					console.error(
						'Failed to fetch categories:',
						categoriesResponse.statusText
					);
					setCategories([]);
				}
			} catch (error) {
				console.error('Error fetching categories:', error);
				setCategories([]);
			} finally {
				setCategoriesLoading(false);
			}
		};
		fetchCategories();
	}, []);

	const fetchPosts = async (
		pageNum: number,
		categorySlug: string | null,
		search: string
	) => {
		setLoading(true);

		try {
			const queryParams = new URLSearchParams();
			queryParams.set('page', pageNum.toString());
			if (categorySlug) {
				queryParams.set('category', categorySlug);
			}
			if (search) {
				queryParams.set('search', search);
			}

			const url = `/api/blogs?${queryParams.toString()}`;
			const postsResponse = await fetch(url);

			if (postsResponse.ok) {
				const data = await postsResponse.json();
				setPosts(data.posts || []);
				setPagination({
					page: data.pagination?.page || 1,
					totalPages: data.pagination?.totalPages || 1,
					total: data.pagination?.total || 0,
				});
			} else {
				console.error(
					'Failed to fetch posts:',
					postsResponse.statusText
				);
				setPosts([]);
				setPagination({ page: 1, totalPages: 1, total: 0 });
			}
		} catch (error) {
			console.error('Error fetching posts data:', error);
			setPosts([]);
			setPagination({ page: 1, totalPages: 1, total: 0 });
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		const currentPage = Number(searchParams.get('page') || '1');
		const currentCategorySlug = searchParams.get('category');
		const currentSearch = searchParams.get('search') || '';

		setSearchTerm(currentSearch);
		fetchPosts(currentPage, currentCategorySlug, currentSearch);

		return () => {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
		};
	}, [searchParams]);

	const updateUrlParams = (newParams: Record<string, string | null>) => {
		const params = new URLSearchParams(searchParams.toString());
		Object.entries(newParams).forEach(([key, value]) => {
			if (value === null || value === undefined || value === '') {
				params.delete(key);
			} else {
				params.set(key, value);
			}
		});
		router.push(`/blogs?${params.toString()}`, { scroll: false });
	};

	const handleCategoryChange = (categorySlug: string | null) => {
		updateUrlParams({ page: '1', category: categorySlug });
	};

	const handlePageChange = (newPage: number) => {
		updateUrlParams({ page: newPage.toString() });
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newSearchTerm = e.target.value;
		setSearchTerm(newSearchTerm);

		if (debounceTimeout) {
			clearTimeout(debounceTimeout);
		}

		const timeout = setTimeout(() => {
			updateUrlParams({
				page: '1',
				search: newSearchTerm.trim() || null,
			});
		}, 500);

		setDebounceTimeout(timeout);
	};

	useEffect(() => {
		return () => {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
		};
	}, [debounceTimeout]);

	const currentCategorySlug = searchParams.get('category');
	const currentSearchTerm = searchParams.get('search');
	const showLoadingSpinner = loading || categoriesLoading;
	const isCurrentlyFiltered = !!currentCategorySlug || !!currentSearchTerm;

	const showComingSoon =
		!showLoadingSpinner && pagination.total === 0 && !isCurrentlyFiltered;
	const showNoResults =
		!showLoadingSpinner && pagination.total === 0 && isCurrentlyFiltered;
	const showContent =
		!showLoadingSpinner &&
		(pagination.total === undefined || pagination.total > 0);

	return (
		<div className='flex flex-col'>
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

			<section className='section-padding z-10'>
				<div className='container'>
					<div className="flex justify-between items-center mb-6">
						<div></div>
						<Button onClick={handleCreateBlog} className="hover-lift hover-glow">
							<Plus className="mr-2 h-4 w-4" />
							Add New Blog
						</Button>
					</div>

					<div className='relative w-full max-w-full mb-6 md:mb-10'>
						<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
						<Input
							type='search'
							placeholder='Search articles...'
							className='pl-10'
							value={searchTerm}
							onChange={handleSearchChange}
						/>
					</div>

					{showLoadingSpinner && <BlogLoadingSkeleton />}

					{showComingSoon && (
						<div className='flex flex-col items-center justify-center py-20'>
							<h2 className='text-3xl font-bold mb-4'>
								Coming Soon
							</h2>
							<p className='text-muted-foreground text-center max-w-lg'>
								We're working on creating amazing blog content
								for you. Check back soon for insightful articles
								and updates!
							</p>
						</div>
					)}

					{showNoResults && (
						<div className='rounded-lg border border-dashed p-10 text-center'>
							<h3 className='mb-2 text-xl font-semibold'>
								No Blog Posts Found
							</h3>
							<p className='mb-6 text-muted-foreground'>
								{currentSearchTerm
									? `No results match "${currentSearchTerm}". Try different keywords or browse categories.`
									: 'There are no blog posts in this category yet. Check back soon!'}
							</p>
							<Button
								variant='outline'
								onClick={() => {
									router.push('/blogs');
								}}
							>
								Reset Filters
							</Button>
						</div>
					)}

					{showContent && (
						<>
							<div
								className='flex overflow-x-auto pb-2 mb-8 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:gap-2 md:mb-10'
								style={{
									msOverflowStyle: 'none',
									scrollbarWidth: 'none',
								}}
							>
								<style jsx>{`
									div::-webkit-scrollbar {
										display: none;
									}
								`}</style>

								<Button
									key='all-category-button'
									variant={
										currentCategorySlug === null
											? 'default'
											: 'outline'
									}
									size='sm'
									onClick={() => handleCategoryChange(null)}
									className='flex-shrink-0 mr-2 md:mr-0'
								>
									All
								</Button>

								{!categoriesLoading &&
									categories.map((cat) => {
										// Defensive check: Ensure slug exists before rendering button
										if (!cat.slug) return null;
										return (
											<Button
												key={cat.slug}
												variant={
													currentCategorySlug ===
													cat.slug
														? 'default'
														: 'outline'
												}
												size='sm'
												onClick={() =>
													handleCategoryChange(
														cat.slug
													)
												}
												className='flex-shrink-0 mr-2 md:mr-0'
											>
												{cat.name}
											</Button>
										);
									})}
							</div>

							{!loading &&
								posts.length === 0 &&
								isCurrentlyFiltered &&
								!showNoResults && (
									<div className='rounded-lg border border-dashed p-10 text-center'>
										<h3 className='mb-2 text-xl font-semibold'>
											No Blog Posts Found
										</h3>
										<p className='mb-6 text-muted-foreground'>
											Your search or filter criteria did
											not match any posts.
										</p>
										<Button
											variant='outline'
											onClick={() => {
												router.push('/blogs');
											}}
										>
											Reset Filters
										</Button>
									</div>
								)}

							{!loading && posts.length > 0 && (
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
													sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
													priority={false}
												/>
											</div>
											<CardContent className='p-4 sm:p-6 flex flex-col flex-1'>
												<div className='flex-1'>
													<div className='mb-2 flex items-center gap-2 flex-wrap'>
														<span className='rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary whitespace-nowrap'>
															{post.category_name}
														</span>
														{!post.published && (
															<span className='rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-700 whitespace-nowrap'>
																Draft
															</span>
														)}
														<span className='text-xs text-muted-foreground whitespace-nowrap'>
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
													<p className='mb-4 line-clamp-2 text-sm text-muted-foreground'>
														{post.excerpt}
													</p>
												</div>
												<div className='flex flex-wrap items-center justify-between gap-2 h-auto sm:h-10 border-t pt-4 sm:pt-2'>
													<span className='text-sm text-muted-foreground truncate max-w-[180px] sm:max-w-none'>
														By{' '}
														{post.author_name ||
															'Unknown Author'}
													</span>
													<div className="flex items-center gap-2">
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
														<Button
															variant='ghost'
															size='sm'
															onClick={() => handleEditBlog(post.id)}
														>
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															variant='ghost'
															size='sm'
															onClick={() => handleDeleteBlog(post.id, post.title)}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}

							{!loading && pagination.totalPages > 1 && (
								<div className='mt-10'>
									<BlogPagination
										currentPage={pagination.page}
										totalPages={pagination.totalPages}
										onPageChange={handlePageChange}
									/>
								</div>
							)}
						</>
					)}
				</div>
			</section>

			<PasswordDialog
				open={showPasswordDialog}
				onOpenChange={setShowPasswordDialog}
				onSuccess={handleAuthSuccess}
				title="Blog Management Authentication"
				description="Please enter the password to manage blog posts."
			/>
		</div>
	);
}