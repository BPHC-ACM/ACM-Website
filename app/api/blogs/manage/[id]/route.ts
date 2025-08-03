import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// Get blog post for editing
export async function GET(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = await params;

		const supabase = await createServerSupabaseClient();

		const { data, error } = await supabase
			.from('blog_posts')
			.select('*')
			.eq('id', id)
			.single();

		if (error) {
			console.error('Error fetching blog post:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		if (!data) {
			return NextResponse.json(
				{ error: 'Blog post not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(data);
	} catch (err) {
		console.error('Unexpected error fetching blog post:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// Update blog post
export async function PUT(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = await params;
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

		// Check if slug already exists (excluding current post)
		const { data: existingPost } = await supabase
			.from('blog_posts')
			.select('id')
			.eq('slug', slug)
			.neq('id', id)
			.single();

		if (existingPost) {
			return NextResponse.json(
				{ error: 'A blog post with this slug already exists' },
				{ status: 400 }
			);
		}

		const { data, error } = await supabase
			.from('blog_posts')
			.update({
				title,
				slug,
				excerpt: excerpt || '',
				content,
				featured_image: featured_image || '',
				category_id,
				published: published || false,
				updated_at: new Date().toISOString(),
			})
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Error updating blog post:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		if (!data) {
			return NextResponse.json(
				{ error: 'Blog post not found' },
				{ status: 404 }
			);
		}

		return NextResponse.json(data);
	} catch (err) {
		console.error('Unexpected error updating blog post:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}

// Delete blog post
export async function DELETE(
	request: Request,
	{ params }: { params: { id: string } }
) {
	try {
		const { id } = await params;

		const supabase = await createServerSupabaseClient();

		const { error } = await supabase
			.from('blog_posts')
			.delete()
			.eq('id', id);

		if (error) {
			console.error('Error deleting blog post:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json({ message: 'Blog post deleted successfully' });
	} catch (err) {
		console.error('Unexpected error deleting blog post:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}