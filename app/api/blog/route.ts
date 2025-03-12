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
      author_id
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
		// Using the category_slug field instead of joining with categories table
		query = query.eq('category_slug', category.toLowerCase());
		countQuery = countQuery.eq('category_slug', category.toLowerCase());
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

	// If we need to fetch author information separately
	let postsWithAuthors = posts;
	if (posts && posts.length > 0) {
		const authorIds = [...new Set(posts.map((post) => post.author_id))];

		const { data: authors } = await supabase
			.from('authors')
			.select('id, name, avatar_url')
			.in('id', authorIds);

		if (authors) {
			postsWithAuthors = posts.map((post) => {
				const author = authors.find((a) => a.id === post.author_id);
				return {
					...post,
					author: author || null,
				};
			});
		}
	}

	console.log(
		`Fetched ${posts?.length || 0} posts, total count: ${totalCount || 0}`
	);

	return NextResponse.json({
		posts: postsWithAuthors || [],
		pagination: {
			total: totalCount || 0,
			page,
			pageSize,
			totalPages: Math.ceil((totalCount || 0) / pageSize),
		},
	});
}
