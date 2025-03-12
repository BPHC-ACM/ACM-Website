import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';
import { marked } from 'marked';

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } }
) {
	const { slug } = await params;

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll: async () => {
					const cookiesStore = await cookies();
					return cookiesStore.getAll();
				},
				setAll: () => {},
			},
		}
	);

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

		const contentString =
			typeof data.content === 'string' ? data.content : '';

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
