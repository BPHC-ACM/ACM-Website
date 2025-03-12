import { Card } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2, Tag, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';

export const revalidate = 3600;

interface BlogPost {
	id: string;
	slug: string;
	title: string;
	excerpt?: string;
	content: string;
	created_at: string;
	featured_image?: string;
	author_name: string;
	category_name?: string;
	category_slug?: string;
	published: boolean;
}

interface BlogPostData {
	post: BlogPost;
	prevPost?: { title: string; slug: string };
	nextPost?: { title: string; slug: string };
}

async function getBlogPost(slug: string): Promise<BlogPostData | null> {
	const headersList = await headers();
	const host = headersList.get('host') || 'localhost:3000';
	const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';

	const response = await fetch(`${protocol}://${host}/api/blogs/${slug}`, {
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
	const { slug } = await params;
	const data = await getBlogPost(slug);

	if (!data || !data.post || !data.post.published) {
		notFound();
	}

	const { post, prevPost, nextPost } = data;

	const wordCount = post.content.split(/\s+/).length;
	const readTime = Math.max(1, Math.ceil(wordCount / 225));

	const formattedDate = new Date(post.created_at).toLocaleDateString(
		'en-US',
		{
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}
	);

	const contentHtml = post.content.replace(/\n/g, '<br />');

	return (
		<div className='flex flex-col min-h-screen bg-background'>
			{/* Navigation Bar */}
			<header className='sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b'>
				<div className='container py-3'>
					<div className='flex items-center justify-between'>
						<Link
							href='/blogs'
							className='flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors'
						>
							<ArrowLeft className='mr-2 h-4 w-4' />
							All Articles
						</Link>
						<div className='flex items-center gap-4'>
							<button
								className='p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-primary transition-all'
								title='Share article'
							>
								<Share2 className='h-4 w-4' />
							</button>
						</div>
					</div>
				</div>
			</header>

			<main className='flex-grow'>
				{/* Hero Section */}
				<section className='py-10 md:py-16 bg-gradient-to-b from-muted/50 to-background'>
					<div className='container max-w-4xl'>
						<div className='flex flex-col items-center text-center'>
							{post.category_name && (
								<Link
									href={`/blogs/category/${
										post.category_slug || ''
									}`}
									className='mb-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20 transition-colors'
								>
									<Tag className='h-3 w-3' />
									{post.category_name}
								</Link>
							)}
							<h1 className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6'>
								{post.title}
							</h1>
							{post.excerpt && (
								<p className='text-lg text-muted-foreground mb-8 max-w-3xl'>
									{post.excerpt}
								</p>
							)}

							<div className='flex items-center justify-center gap-6 text-sm'>
								<div className='flex items-center gap-2'>
									<div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground'>
										{post.author_name
											.split(' ')
											.map((n) => n[0])
											.join('')
											.toUpperCase()}
									</div>
									<span className='font-medium'>
										{post.author_name}
									</span>
								</div>
								<div className='flex items-center gap-2 text-muted-foreground'>
									<Calendar className='h-4 w-4' />
									<span>{formattedDate}</span>
								</div>
								<div className='flex items-center gap-2 text-muted-foreground'>
									<Clock className='h-4 w-4' />
									<span>{readTime} min read</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Featured Image */}
				{post.featured_image && (
					<div className='container max-w-4xl mb-10'>
						<div className='rounded-lg overflow-hidden shadow-lg'>
							<div className='relative aspect-[16/9]'>
								<Image
									src={post.featured_image}
									alt={post.title}
									fill
									priority
									className='object-cover'
									sizes='(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px'
								/>
							</div>
						</div>
					</div>
				)}

				{/* Blog Content */}
				<section className='container max-w-3xl py-8'>
					<article className='prose prose-lg dark:prose-invert max-w-none'>
						<div
							dangerouslySetInnerHTML={{ __html: contentHtml }}
						/>
					</article>

					{/* Author Bio Card */}
					<div className='mt-16 rounded-xl border bg-card/50 p-6'>
						<div className='flex flex-col sm:flex-row gap-5'>
							<div className='flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground'>
								{post.author_name
									.split(' ')
									.map((n) => n[0])
									.join('')
									.toUpperCase()}
							</div>
							<div>
								<p className='text-sm text-muted-foreground mb-1'>
									WRITTEN BY
								</p>
								<h3 className='text-xl font-semibold mb-2'>
									{post.author_name}
								</h3>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
