import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import BlogPagination from "./blog-pagination"

export const revalidate = 3600 // Revalidate every hour

async function getCategories() {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase.from("categories").select("*")
  return data || []
}

async function getBlogPosts(page = 1, category = "All") {
  const response = await fetch(`/api/blog?page=${page}&category=${category}`, { next: { revalidate } })

  if (!response.ok) {
    throw new Error("Failed to fetch blog posts")
  }

  return response.json()
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const category = searchParams.category || "All"

  const categoriesPromise = getCategories()
  const blogDataPromise = getBlogPosts(page, category)

  const [categories, blogData] = await Promise.all([categoriesPromise, blogDataPromise])

  const { posts, pagination } = blogData

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-card py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              <span className="heading-gradient">ACM Blog</span>
            </h1>
            <p className="mb-0 text-lg text-muted-foreground md:text-xl">
              Insights, tutorials, and updates from our community.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="section-padding">
        <div className="container">
          <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="search" placeholder="Search articles..." className="pl-10" />
            </div>
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <Button key="all" variant={category === "All" ? "default" : "outline"} size="sm" asChild>
                <Link href="/blog?category=All">All</Link>
              </Button>
              {categories.map((cat) => (
                <Button key={cat.id} variant={category === cat.name ? "default" : "outline"} size="sm" asChild>
                  <Link href={`/blog?category=${encodeURIComponent(cat.name)}`}>{cat.name}</Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Blog Posts Grid */}
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-video relative">
                    <Image
                      src={post.featured_image || "/placeholder.svg?height=200&width=400"}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {post.categories?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="mb-2 text-xl font-bold">
                      <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mb-4 line-clamp-2 text-muted-foreground">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">By {post.authors?.name}</span>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/blog/${post.slug}`}>Read More</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <h3 className="mb-2 text-xl font-semibold">No Blog Posts Found</h3>
              <p className="mb-6 text-muted-foreground">
                There are no blog posts in this category yet. Check back soon!
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-10">
              <BlogPagination currentPage={pagination.page} totalPages={pagination.totalPages} category={category} />
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

