import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const slug = params.slug

  const supabase = createRouteHandlerClient<Database>({ cookies })

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      *,
      categories(name),
      authors(name, bio, avatar_url)
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }

  // Get related posts
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select(`
      id,
      title,
      slug,
      excerpt
    `)
    .eq("category_id", data.category_id)
    .eq("published", true)
    .neq("id", data.id)
    .limit(2)

  return NextResponse.json({
    post: data,
    relatedPosts,
  })
}

