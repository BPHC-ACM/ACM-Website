import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const supabase = await createServerSupabaseClient();

		const { data, error } = await supabase
			.from('categories')
			.select('id, name, slug')
			.order('name');

		if (error) {
			console.error('Error fetching all categories:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(data || []);
	} catch (err) {
		console.error('Unexpected error fetching all categories:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}