import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// Create new blog post
export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { title, slug, excerpt, content, featured_image, category_id, published } = body;

		// Basic validation
		if (!title || !content || !category_id) {
			return NextResponse.json(
				{ error: 'Title, content, and category are required' },
				{ status: 400 }
			);
		}

		const supabase = await createServerSupabaseClient();

		// Check if slug already exists
		const { data: existingPost } = await supabase
			.from('blog_posts')
			.select('id')
			.eq('slug', slug)
			.single();

		if (existingPost) {
			return NextResponse.json(
				{ error: 'A blog post with this slug already exists' },
				{ status: 400 }
			);
		}

		// For now, we'll use a default author_id. In a real app, this would come from authentication
		const defaultAuthorId = '00000000-0000-0000-0000-000000000000';

		const { data, error } = await supabase
			.from('blog_posts')
			.insert({
				title,
				slug,
				excerpt: excerpt || '',
				content,
				featured_image: featured_image || '',
				category_id,
				author_id: defaultAuthorId,
				published: published || false,
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating blog post:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(data);
	} catch (err) {
		console.error('Unexpected error creating blog post:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}