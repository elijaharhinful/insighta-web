import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = []
    const showMax = 5
    
    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, -1, totalPages)
      } else if (page >= totalPages - 2) {
        pages.push(1, -1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, -1, page - 1, page, page + 1, -1, totalPages)
      }
    }
    return pages
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-1">
        <li>
          <Button
            variant="ghost"
            size="default"
            className="gap-1 pl-2.5"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>
        </li>

        {getPageNumbers().map((p, i) => (
          <li key={i}>
            {p === -1 ? (
              <span
                aria-hidden
                className="flex h-9 w-9 items-center justify-center"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More pages</span>
              </span>
            ) : (
              <Button
                variant={p === page ? "outline" : "ghost"}
                size="icon"
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
              >
                {p}
              </Button>
            )}
          </li>
        ))}

        <li>
          <Button
            variant="ghost"
            size="default"
            className="gap-1 pr-2.5"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </li>
      </ul>
    </nav>
  )
}
