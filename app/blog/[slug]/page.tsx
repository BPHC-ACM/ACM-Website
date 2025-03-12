import { CardContent } from '@/components/ui/card';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

export const revalidate = 3600; // Revalidate every hour

// Define TypeScript interfaces for your data
interface Author {
	name: string;
	avatar_url?: string;
	bio?: string;
}

interface Category {
	name: string;
}

interface BlogPost {
	id: string;
	slug: string;
	title: string;
	excerpt?: string;
	content: string;
	created_at: string;
	featured_image?: string;
	authors?: Author;
	categories?: Category;
}

interface BlogPostData {
	post: BlogPost;
	relatedPosts?: BlogPost[];
}

async function getBlogPost(slug: string): Promise<BlogPostData | null> {
	// Get the host from headers to build the absolute URL
	const headersList = await headers();
	const host = headersList.get('host') || 'localhost:3000';
	const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

	// Use absolute URL with protocol and host
	const response = await fetch(`${protocol}://${host}/api/blog/${slug}`, {
		next: { revalidate },
	});

	if (!response.ok) {
		return null;
	}

	return response.json();
}

export default async function BlogPostPage({
	params,
}: {
	params: { slug: string };
}) {
	const data = await getBlogPost(params.slug);

	if (!data || !data.post) {
		notFound();
	}

	const { post, relatedPosts = [] } = data;

	return (
		<div className='flex flex-col'>
			{/* Hero Section */}
			<section className='bg-card py-16 md:py-24'>
				<div className='container'>
					<div className='mx-auto max-w-3xl text-center'>
						<Link
							href='/blog'
							className='mb-6 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary'
						>
							<ArrowLeft className='mr-2 h-4 w-4' />
							Back to Blog
						</Link>
						<h1 className='mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl'>
							{post.title}
						</h1>
						<div className='flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground'>
							<div className='flex items-center'>
								<Calendar className='mr-1 h-4 w-4' />
								{new Date(post.created_at).toLocaleDateString(
									'en-US',
									{
										day: 'numeric',
										month: 'long',
										year: 'numeric',
									}
								)}
							</div>
							<div className='flex items-center'>
								<User className='mr-1 h-4 w-4' />
								{post.authors?.name}
							</div>
							<div className='rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary'>
								{post.categories?.name}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Image */}
			<div className='container -mt-12 mb-12'>
				<div className='mx-auto aspect-video max-w-4xl overflow-hidden rounded-lg shadow-lg'>
					<Image
						src={
							post.featured_image ||
							'/placeholder.svg?height=400&width=800'
						}
						alt={post.title}
						width={800}
						height={400}
						className='h-full w-full object-cover'
					/>
				</div>
			</div>

			{/* Blog Content */}
			<section className='section-padding z-10'>
				<div className='container'>
					<div className='mx-auto max-w-3xl'>
						<article className='prose prose-lg dark:prose-invert max-w-none'>
							<div
								dangerouslySetInnerHTML={{
									__html: post.content,
								}}
							/>
						</article>

						{/* Author Bio */}
						<div className='mt-10 rounded-lg border bg-card p-6'>
							<div className='flex items-center gap-4'>
								<div className='h-12 w-12 overflow-hidden rounded-full bg-muted'>
									<Image
										src={
											post.authors?.avatar_url ||
											'/placeholder.svg?height=48&width=48'
										}
										alt={post.authors?.name || 'Author'}
										width={48}
										height={48}
										className='h-full w-full object-cover'
									/>
								</div>
								<div>
									<h3 className='text-lg font-semibold'>
										{post.authors?.name}
									</h3>
									<p className='text-sm text-muted-foreground'>
										{post.authors?.bio || 'ACM Member'}
									</p>
								</div>
							</div>
						</div>

						{/* Related Posts */}
						{relatedPosts.length > 0 && (
							<div className='mt-10'>
								<h2 className='mb-6 text-2xl font-bold'>
									Related Posts
								</h2>
								<div className='grid gap-6 sm:grid-cols-2'>
									{relatedPosts.map(
										(relatedPost: BlogPost) => (
											<Card
												key={relatedPost.id}
												className='overflow-hidden'
											>
												<CardContent className='p-6'>
													<h3 className='mb-2 text-xl font-bold'>
														<Link
															href={`/blog/${relatedPost.slug}`}
															className='hover:text-primary'
														>
															{relatedPost.title}
														</Link>
													</h3>
													<p className='mb-4 text-muted-foreground'>
														{relatedPost.excerpt}
													</p>
													<Button
														asChild
														variant='ghost'
														size='sm'
													>
														<Link
															href={`/blog/${relatedPost.slug}`}
														>
															Read More
														</Link>
													</Button>
												</CardContent>
											</Card>
										)
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
