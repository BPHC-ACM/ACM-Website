import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

type CategoryResponse = {
	id: string;
	name: string;
}[];

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
					setAll: () => {},
				},
			}
		);

		const { data, error } = await supabase
			.from('blog_posts')
			.select('category_name, category_slug')
			.filter('published', 'eq', true)
			.order('category_name');

		if (error) {
			console.error('Error fetching categories:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		const uniqueCategories = new Map<
			string,
			{ category_name: string; category_slug: string }
		>();

		data?.forEach((category) => {
			if (!uniqueCategories.has(category.category_name)) {
				uniqueCategories.set(category.category_name, category);
			}
		});

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
