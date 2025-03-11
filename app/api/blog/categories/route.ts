import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/lib/database.types';

export async function GET() {
	try {
		const supabase = createRouteHandlerClient<Database>({ cookies });

		// Fetch all categories
		const { data, error } = await supabase
			.from('categories')
			.select('id, name')
			.order('name');

		if (error) {
			console.error('Error fetching categories:', error);
			return NextResponse.json({ error: error.message }, { status: 500 });
		}

		return NextResponse.json(data || []);
	} catch (err) {
		console.error('Unexpected error fetching categories:', err);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
