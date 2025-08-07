import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

// Create new blog post
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, featured_image, categories, published, author } = body;

    // Basic validation
    if (!title || !content || !categories || categories.length === 0 || !author) {
      return NextResponse.json(
        { error: 'Title, content, categories, and author are required' },
        { status: 400 },
      );
    }

    const supabase = await createServerSupabaseClient();

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingPost) {
      return NextResponse.json(
        { error: 'A blog post with this slug already exists' },
        { status: 400 },
      );
    }

    // Use the first category as the main category (since schema only supports one)
    const mainCategory = categories[0];
    // Convert to slug format consistent with frontend title case conversion
    const categorySlug = mainCategory.toLowerCase().replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt: excerpt || '',
        content,
        featured_image: featured_image || '',
        author_name: author,
        category_name: mainCategory,
        category_slug: categorySlug,
        published: published || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Unexpected error creating blog post:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
