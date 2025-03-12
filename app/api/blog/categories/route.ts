import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

// Define the response type for categories
type CategoryResponse = {
	id: string;
	name: string;
}[];

// Define the blog post structure after our schema change
interface BlogPost {
	id: string;
	created_at: string;
	updated_at: string;
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	featured_image: string;
	author_id: string;
	published: boolean;
	category_name: string;
	category_slug: string;
}

export async function GET(): Promise<
	NextResponse<CategoryResponse | { error: string }>
> {
	try {
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					getAll: async () => {
						const cookiesStore = await cookies();
						return cookiesStore.getAll();
					},
					setAll: () => {}, // No-op in route handlers
				},
			}
		);

		// Use a raw SQL query to get distinct categories
		const { data, error } = await supabase
			.from('blog_posts')
			.select('category_name, category_slug')
			.filter('published', 'eq', true)
			.order('category_name');

		if (error) {
			console.error('Error fetching categories:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		// Manually filter for unique categories
		const uniqueCategories = new Map<
			string,
			{ category_name: string; category_slug: string }
		>();

		data?.forEach((category) => {
			if (!uniqueCategories.has(category.category_name)) {
				uniqueCategories.set(category.category_name, category);
			}
		});

		// Format the response to match the previous structure
		const formattedData: CategoryResponse = Array.from(
			uniqueCategories.values()
		).map((category) => ({
			id: category.category_slug,
			name: category.category_name,
		}));

		return NextResponse.json(formattedData);
	} catch (err) {
		console.error('Unexpected error fetching categories:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
