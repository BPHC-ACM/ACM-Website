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
      id,
      title,
      slug,
      excerpt,
      content,
      created_at,
      featured_image,
      published,
      category_name,
      category_slug,
      author_name
      `
		)
		.eq('published', true)
		.order('created_at', { ascending: false })
		.range(offset, offset + pageSize - 1);

	let countQuery = supabase
		.from('blog_posts')
		.select('id', { count: 'exact', head: true })
		.eq('published', true);

	if (category && category !== 'All') {
		query = query.eq('category_slug', category.toLowerCase());
		countQuery = countQuery.eq('category_slug', category.toLowerCase());
	}

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

	// We're not fetching authors separately since author_name is already in blog_posts table
	// based on the data structure you provided

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
