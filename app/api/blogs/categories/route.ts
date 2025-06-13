import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

interface CategoryResponseItem {
	slug: string;
	name: string;
}

type CategoryResponse = CategoryResponseItem[] | { error: string };

export async function GET(): Promise<NextResponse<CategoryResponse>> {
	try {
		const supabase = await createServerSupabaseClient();

		const { data, error } = await supabase
			.from('blog_posts')
			.select('category_name, category_slug')
			.filter('published', 'eq', true)
			.filter('category_slug', 'neq', '')
			.filter('category_name', 'neq', '')
			.order('category_slug')
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching categories:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		if (!data) {
			return NextResponse.json([]);
		}

		const uniqueCategoriesBySlug = new Map<string, CategoryResponseItem>();

		data.forEach((category) => {
			if (category.category_slug && category.category_name) {
				if (!uniqueCategoriesBySlug.has(category.category_slug)) {
					uniqueCategoriesBySlug.set(category.category_slug, {
						slug: category.category_slug,
						name: category.category_name,
					});
				}
			}
		});

		const formattedData: CategoryResponseItem[] = Array.from(
			uniqueCategoriesBySlug.values()
		);

		formattedData.sort((a, b) => a.name.localeCompare(b.name));

		return NextResponse.json(formattedData);
	} catch (err) {
		console.error('Unexpected error fetching categories:', err);

		const errorResponse: { error: string } = {
			error: 'Internal server error',
		};
		return NextResponse.json(errorResponse, { status: 500 });
	}
}
