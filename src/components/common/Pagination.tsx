"use client"

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ totalPages, currentPage, onPageChange }: PaginationProps) {
  // 표시할 페이지 번호 계산
  const getPageNumbers = () => {
    const result = []
    const maxPagesToShow = 4 // 생략 부호와 마지막 페이지를 고려하여 4개로 설정

    if (totalPages <= maxPagesToShow + 1) {
      // 전체 페이지가 5개 이하면 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        result.push({ type: "page", value: i })
      }
    } else {
      // 항상 첫 페이지 표시
      result.push({ type: "page", value: 1 })

      if (currentPage <= 3) {
        // 현재 페이지가 앞쪽에 있는 경우
        for (let i = 2; i <= Math.min(maxPagesToShow, totalPages - 1); i++) {
          result.push({ type: "page", value: i })
        }
        result.push({ type: "ellipsis" })
      } else if (currentPage >= totalPages - 2) {
        // 현재 페이지가 뒤쪽에 있는 경우
        result.push({ type: "ellipsis" })
        for (let i = totalPages - maxPagesToShow + 1; i < totalPages; i++) {
          result.push({ type: "page", value: i })
        }
      } else {
        // 현재 페이지가 중간에 있는 경우
        result.push({ type: "ellipsis" })
        result.push({ type: "page", value: currentPage - 1 })
        result.push({ type: "page", value: currentPage })
        result.push({ type: "page", value: currentPage + 1 })
        result.push({ type: "ellipsis" })
      }

      // 항상 마지막 페이지 표시
      if (totalPages > 1) {
        result.push({ type: "page", value: totalPages })
      }
    }

    return result
  }

  return (
    <div className="flex justify-center items-center space-x-2 my-8" data-cy="pagination">
      {/* 첫 페이지로 이동 버튼 */}
      <button
        onClick={() => onPageChange(0)}
        disabled={currentPage === 0}
        className={cn(
          "p-2 rounded-full",
          currentPage === 0 ? "text-disabled-text cursor-not-allowed" : "text-main-color hover:bg-secondary-color",
        )}
        aria-label="첫 페이지로 이동"
        data-cy="first-page-button"
      >
        <ChevronsLeft className="h-5 w-5" />
      </button>

      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={cn(
          "p-2 rounded-full",
          currentPage === 0 ? "text-disabled-text cursor-not-allowed" : "text-main-color hover:bg-secondary-color",
        )}
        aria-label="이전 페이지"
        data-cy="prev-page-button"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* 페이지 번호 */}
      {getPageNumbers().map((item, index) => {
        if (item.type === "ellipsis" || item.value === undefined) {
          return (
            <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-black" data-cy="page-button">
              ...
            </span>
          )
        }

        return (
          <button
            key={`page-${item.value}`}
            onClick={() => onPageChange(item.value - 1)} // 오류 생길 수 있으니 잘 보고 고쳐주세여...
            className={cn(
              "min-w-8 w-fit h-8 px-2 flex items-center justify-center rounded-full",
              currentPage + 1 === item.value ? "bg-main-color text-white font-medium" : "text-black hover:bg-gray-100",
            )}
            disabled={currentPage + 1 === item.value}
            data-cy="page-button"
          >
            {item.value}
          </button>
        )
      })}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 === totalPages}
        className={cn(
          "p-2 rounded-full",
          currentPage + 1 === totalPages ? "text-disabled-text cursor-not-allowed" : "text-main-color hover:bg-secondary-color",
        )}
        aria-label="다음 페이지"
        data-cy="next-page-button"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* 마지막 페이지로 이동 버튼 */}
      <button
        onClick={() => onPageChange(totalPages - 1)}
        disabled={currentPage + 1 === totalPages}
        className={cn(
          "p-2 rounded-full",
          currentPage + 1 === totalPages ? "text-disabled-text cursor-not-allowed" : "text-main-color hover:bg-secondary-color",
        )}
        aria-label="마지막 페이지로 이동"
        data-cy="last-page-button"
      >
        <ChevronsRight className="h-5 w-5" />
      </button>
    </div>
  )
}
