import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { ComponentProps, ReactNode } from 'react';
import ShareButton from '@/components/share-button';
import { createServerSupabaseClient } from '@/lib/supabase-server';

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
}

interface CodeProps extends ComponentProps<'code'> {
	inline?: boolean;
	className?: string;
	children: ReactNode;
}

export default async function BlogPostPage({
	params,
}: {
	params: { slug: string };
}) {
	const { slug } = await params;

	const supabase = await createServerSupabaseClient();
	const { data: post, error } = await supabase
		.from('blog_posts')
		.select('*') // Select all fields for simplicity
		.eq('slug', slug)
		.eq('published', true)
		.maybeSingle();

	if (error || !post) {
		console.error('Error fetching post or post not found:', error);
		notFound();
	}

	const initials = post.author_name
		?.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase();

	const wordCount = post.content?.split(/\s+/).length;
	const readTime = Math.max(1, Math.ceil(wordCount / 225));

	const formattedDate = new Date(post.created_at).toLocaleDateString(
		'en-US',
		{
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}
	);

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
							<ShareButton />
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
								<div className='mb-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary transition-colors'>
									<Tag className='h-3 w-3' />
									{post.category_name}
								</div>
							)}
							<h1 className='text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6'>
								{post.title}
							</h1>
							{post.excerpt && (
								<p className='text-lg text-muted-foreground mb-8 max-w-3xl'>
									{post.excerpt}
								</p>
							)}

							<div className='flex flex-wrap items-center justify-center gap-6 text-sm'>
								<div className='flex items-center gap-2'>
									<div className='flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground'>
										{initials.length > 2 ? (
											<img
												src='/person.svg'
												alt='Author'
												className='w-8 h-8 rounded-full'
											/>
										) : (
											<div className='w-8 h-8 rounded-full  flex items-center justify-center text-sm font-medium'>
												{initials}
											</div>
										)}
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

				<section className='container max-w-3xl py-8'>
					<article
						className='prose prose-lg prose-a:break-words prose-a:line-clamp-1
 prose-headings:scroll-mt-20 dark:prose-invert prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg max-w-none'
					>
						{post.content.startsWith('<p>') ||
						post.content.startsWith('<h') ? (
							<div
								dangerouslySetInnerHTML={{
									__html: post.content,
								}}
							/>
						) : (
							<ReactMarkdown
								remarkPlugins={[remarkGfm]}
								components={{
									h1: ({ node, ...props }) => (
										<h1
											className='mt-8 mb-4 text-3xl font-bold'
											{...props}
										/>
									),
									h2: ({ node, ...props }) => (
										<h2
											className='mt-8 mb-4 text-2xl font-bold'
											{...props}
										/>
									),
									h3: ({ node, ...props }) => (
										<h3
											className='mt-6 mb-3 text-xl font-bold'
											{...props}
										/>
									),
									p: ({ node, ...props }) => (
										<p
											className='mb-4 leading-relaxed'
											{...props}
										/>
									),
									ul: ({ node, ...props }) => (
										<ul
											className='mb-4 ml-6 list-disc'
											{...props}
										/>
									),
									ol: ({ node, ...props }) => (
										<ol
											className='mb-4 ml-6 list-decimal'
											{...props}
										/>
									),
									blockquote: ({ node, ...props }) => (
										<blockquote
											className='border-l-4 border-primary pl-4 italic my-4'
											{...props}
										/>
									),
									code: ({
										inline,
										className,
										children,
										...props
									}: CodeProps) => {
										const match = /language-(\w+)/.exec(
											className || ''
										);
										return !inline && match ? (
											<SyntaxHighlighter
												style={atomDark}
												language={match[1]}
												PreTag='div'
												className='rounded-md my-4'
												{...props}
											>
												{String(children).replace(
													/\n$/,
													''
												)}
											</SyntaxHighlighter>
										) : (
											<code
												className={`${className} bg-muted px-1.5 py-0.5 rounded text-sm`}
												{...props}
											>
												{children}
											</code>
										);
									},
								}}
							>
								{post.content}
							</ReactMarkdown>
						)}
					</article>

					{/* Author Bio Card */}
					<div className='mt-16 rounded-xl border bg-card/50 p-6'>
						<div className='flex flex-row gap-5'>
							<div className='flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-medium text-primary-foreground'>
								{initials.length > 2 ? (
									<img
										src='/person.svg'
										alt='Author'
										className='w-8 h-8 rounded-full'
									/>
								) : (
									<div className='w-8 h-8 rounded-full  flex items-center justify-center text-sm font-medium'>
										{initials}
									</div>
								)}
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
