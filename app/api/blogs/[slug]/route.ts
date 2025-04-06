import { NextResponse } from 'next/server';
// import { marked } from 'marked'; // REMOVED: No longer needed here
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } }
) {
	const { slug } = await params;

	// Ensure slug is treated as a string
	if (typeof slug !== 'string' || !slug) {
		return NextResponse.json(
			{ error: 'Invalid slug parameter' },
			{ status: 400 }
		);
	}

	const supabase = await createServerSupabaseClient();

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
                category_slug,
                author_name,
                published`
			)
			.eq('slug', slug)
			.eq('published', true) // Ensure boolean comparison
			.maybeSingle(); // Use maybeSingle() to handle null case gracefully

		// Handle potential Supabase errors
		if (error) {
			console.error('Supabase error fetching post by slug:', error);
			// Differentiate between not found and other errors if possible
			if (error.code === 'PGRST116') {
				// PostgREST code for "relation does not exist" or similar - adjust if needed
				return NextResponse.json(
					{ error: 'Post not found' },
					{ status: 404 }
				);
			}
			return NextResponse.json(
				{ error: 'Database query failed' },
				{ status: 500 }
			);
		}

		// Handle case where post is not found (data is null)
		if (!data) {
			return NextResponse.json(
				{ error: 'Post not found or not published' },
				{ status: 404 }
			);
		}

		// REMOVED: HTML conversion using marked
		// const contentString = typeof data.content === 'string' ? data.content : '';
		// const htmlContent = marked(contentString);

		// Return the post data with raw content
		return NextResponse.json({
			post: {
				id: data.id,
				title: data.title,
				slug: data.slug,
				excerpt: data.excerpt,
				content: data.content, // Return the raw Markdown (or HTML if stored as HTML) content
				created_at: data.created_at,
				featured_image: data.featured_image,
				category_name: data.category_name,
				category_slug: data.category_slug, // Include slug if selected
				author_name: data.author_name,
				published: data.published,
			},
		});
	} catch (err) {
		console.error('Unexpected server error fetching post by slug:', err);
		// Avoid exposing detailed error messages in production
		return NextResponse.json(
			{ error: 'An internal server error occurred' },
			{ status: 500 }
		);
	}
}
