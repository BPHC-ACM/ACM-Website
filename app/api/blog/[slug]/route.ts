import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import { marked } from 'marked';

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } }
) {
	const { slug } = params;
	console.log('Fetching blog post with slug:', slug);

	// The createRouteHandlerClient expects a function that returns a Promise<ReadonlyRequestCookies>
	const supabase = createRouteHandlerClient<Database>({
		cookies: () => cookies(),
	});

	try {
		const { data, error } = await supabase
			.from('blog_posts')
			.select(
				`id,
        title,
        slug,
        excerpt,
        content,
        created_at,
        featured_image,
        category_name,
        author_name,
        published`
			)
			.eq('slug', slug as string)
			.eq('published', true as boolean)
			.single();

		if (error) {
			console.error('Supabase error:', error);
			return NextResponse.json({ error: error.message }, { status: 404 });
		}

		if (!data) {
			return NextResponse.json(
				{ error: 'Post not found' },
				{ status: 404 }
			);
		}

		// Handle potential undefined content with type guard
		const contentString =
			typeof data.content === 'string' ? data.content : '';

		// Convert markdown content to HTML
		const htmlContent = marked(contentString);

		return NextResponse.json({
			post: {
				id: data.id,
				title: data.title,
				slug: data.slug,
				excerpt: data.excerpt,
				content: htmlContent,
				created_at: data.created_at,
				featured_image: data.featured_image,
				category_name: data.category_name,
				author_name: data.author_name,
				published: data.published,
			},
		});
	} catch (err) {
		console.error('Unexpected error:', err);
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
