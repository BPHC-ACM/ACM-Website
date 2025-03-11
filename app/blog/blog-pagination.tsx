"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  category?: string
}

export default function BlogPagination({ currentPage, totalPages, category = "All" }: BlogPaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always include first page
      pages.push(1)

      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Adjust if at the beginning
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, 4)
      }

      // Adjust if at the end
      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3)
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("ellipsis-start")
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Add ellipsis before last page if needed
      if (end < totalPages - 1) {
        pages.push("ellipsis-end")
      }

      // Always include last page
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" disabled={currentPage === 1} asChild={currentPage !== 1}>
          {currentPage === 1 ? (
            <span>
              <span className="sr-only">Previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </span>
          ) : (
            <Link
              href={`/blog?page=${currentPage - 1}${category !== "All" ? `&category=${encodeURIComponent(category)}` : ""}`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          )}
        </Button>

        {pageNumbers.map((page, index) => {
          if (page === "ellipsis-start" || page === "ellipsis-end") {
            return (
              <span key={`ellipsis-${index}`} className="px-2">
                ...
              </span>
            )
          }

          return (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              className="h-8 w-8 p-0"
              asChild={currentPage !== page}
            >
              {currentPage === page ? (
                <span>{page}</span>
              ) : (
                <Link
                  href={`/blog?page=${page}${category !== "All" ? `&category=${encodeURIComponent(category)}` : ""}`}
                >
                  {page}
                </Link>
              )}
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          asChild={currentPage !== totalPages}
        >
          {currentPage === totalPages ? (
            <span>
              <span className="sr-only">Next page</span>
              <ChevronRight className="h-4 w-4" />
            </span>
          ) : (
            <Link
              href={`/blog?page=${currentPage + 1}${category !== "All" ? `&category=${encodeURIComponent(category)}` : ""}`}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </Button>
      </div>
    </div>
  )
}

