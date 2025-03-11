import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const category = searchParams.get('category');
	const page = Number.parseInt(searchParams.get('page') || '1');
	const pageSize = 6;
	const offset = (page - 1) * pageSize;

	const supabase = createRouteHandlerClient<Database>({ cookies });

	// Base query for blog posts
	let query = supabase
		.from('blog_posts')
		.select(
			`
      *,
      categories(id, name),
      authors(name, avatar_url)
    `
		)
		.eq('published', true)
		.order('created_at', { ascending: false })
		.range(offset, offset + pageSize - 1);

	// Base query for counting total posts
	let countQuery = supabase
		.from('blog_posts')
		.select('id', { count: 'exact', head: true })
		.eq('published', true);

	// Add category filter if needed
	if (category && category !== 'All') {
		// Assuming there's a direct category_id column in blog_posts
		const { data: categoryData } = await supabase
			.from('categories')
			.select('id')
			.eq('name', category)
			.single();

		if (categoryData && categoryData.id) {
			query = query.eq('category_id', categoryData.id);
			countQuery = countQuery.eq('category_id', categoryData.id);
		}
	}

	// Execute both queries in parallel
	const [postsResult, countResult] = await Promise.all([query, countQuery]);

	const { data: posts, error: postsError } = postsResult;
	const { count: totalCount, error: countError } = countResult;

	if (postsError) {
		console.error('Error fetching blog posts:', postsError);
		return NextResponse.json(
			{ error: postsError.message },
			{ status: 500 }
		);
	}

	if (countError) {
		console.error('Error counting blog posts:', countError);
	}

	console.log(
		`Fetched ${posts?.length || 0} posts, total count: ${totalCount || 0}`
	);

	return NextResponse.json({
		posts: posts || [],
		pagination: {
			total: totalCount || 0,
			page,
			pageSize,
			totalPages: Math.ceil((totalCount || 0) / pageSize),
		},
	});
}
