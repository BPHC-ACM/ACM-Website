import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const page = Number.parseInt(searchParams.get("page") || "1")
  const pageSize = 6
  const offset = (page - 1) * pageSize

  const supabase = createRouteHandlerClient<Database>({ cookies })

  let query = supabase
    .from("blog_posts")
    .select(`
      *,
      categories(name),
      authors(name, avatar_url)
    `)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (category && category !== "All") {
    query = query.eq("categories.name", category)
  }

  const { data, error, count } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Get total count for pagination
  const { count: totalCount } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true })
    .eq("published", true)

  return NextResponse.json({
    posts: data,
    pagination: {
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil((totalCount || 0) / pageSize),
    },
  })
}

