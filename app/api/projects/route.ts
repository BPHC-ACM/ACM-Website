import { createServerSupabaseClient } from '@/lib/supabase-server';
import { CloudCog } from 'lucide-react';
import { NextResponse } from 'next/server';

export const revalidate = 3600;

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from('projects').select('*');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
