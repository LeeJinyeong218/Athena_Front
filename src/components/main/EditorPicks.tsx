"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MainProject } from "@/lib/projectInterface"
import { useRouter } from "next/navigation"

export default function EditorPicks({ projects, isLoading }: {projects: MainProject[], isLoading: boolean}) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(4) // Default to 4 items per page
  const totalPages = Math.ceil(projects.length / itemsPerPage)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  // Calculate total pages based on screen size and items
  useEffect(() => {
    const handleResize = () => {
      let newItemsPerPage = 4 // Default for desktop

      if (window.innerWidth < 768) {
        newItemsPerPage = 1 // Mobile
      } else if (window.innerWidth < 1024) {
        newItemsPerPage = 2 // Tablet
      }

      setItemsPerPage(newItemsPerPage)
    }

    // Initial calculation
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const goToPage = (pageIndex: number) => {
    if (isTransitioning) return

    setIsTransitioning(true)

    // Handle wrapping
    if (pageIndex < 0) {
      pageIndex = totalPages - 1
    } else if (pageIndex >= totalPages) {
      pageIndex = 0
    }

    setCurrentPage(pageIndex)

    setTimeout(() => {
      setIsTransitioning(false)
    }, 500)
  }

  const goToPrevPage = () => {
    goToPage((currentPage - 1 + totalPages) % totalPages)
  }

  const goToNextPage = () => {
    goToPage((currentPage + 1) % totalPages)
  }

  // Create page data with placeholders for empty slots
  const getPageData = () => {
    const pages = []

    for (let i = 0; i < totalPages; i++) {
      const startIndex = i * itemsPerPage
      const pageItems = projects.slice(startIndex, startIndex + itemsPerPage)

      // Fill remaining slots with empty placeholders to maintain grid layout
      const emptySlots = itemsPerPage - pageItems.length
      const filledPage = [
        ...pageItems,
        ...Array(emptySlots)
          .fill(null)
          .map((_, index) => ({ id: `empty-${index}`, isEmpty: true })),
      ]

      pages.push(filledPage)
    }

    return pages
  }

  const moveToProjectPage = (projectId: number) => {
    router.push(`/project/${projectId}`)
  }
  
  const pages = getPageData()

  if (projects === null || projects.length === 0) {
    return <div>로딩 중입니다.</div> // 로딩 표시 필요
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Title */}
      <h2 className="text-center text-3xl font-bold mb-8">
        에디터 <span className="text-main-color">PICK</span> <span className="text-main-color">💖</span>
      </h2>

      {/* Carousel Container */}
      <div className="relative">
        <div ref={containerRef} className="overflow-hidden">
          <div
            className={cn("flex transition-transform duration-500 ease-out", isTransitioning ? "" : "")}
            style={{
              transform: `translateX(-${currentPage * 100}%)`,
            }}
          >


            {/* Pages Container */}
            {pages.map((pageItems, pageIndex) => (
              <div key={pageIndex} className="w-full flex-shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pageItems.map((item: any) => {
                    if (item?.isEmpty) {
                      // Empty placeholder to maintain grid layout
                      return <div key={new Date().toString()} className="aspect-square invisible"></div>
                    }

                    return (
                      <div
                        key={item.projectId}
                        className="rounded-xl overflow-hidden bg-white"
                        onClick={() => moveToProjectPage(item.projectId)}
                      >
                        <div className="aspect-square relative overflow-hidden rounded-xl">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-gray-500 text-sm">{item.sellerName}</p>
                          <h3 className="font-bold text-lg mt-1">{item.title}</h3>
                          <p className="text-sm mt-1 text-gray-700">{item.description}</p>
                          <p className="text-[#fb6f92] font-bold mt-2">{item.achievement}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={goToPrevPage}
          className="absolute left-0 top-1/3 -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all duration-300"
          aria-label="이전 페이지"
        >
          <ChevronLeft className="h-6 w-6 text-[#808080]" />
        </button>

        <button
          onClick={goToNextPage}
          className="absolute right-0 top-1/3 -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-all duration-300"
          aria-label="다음 페이지"
        >
          <ChevronRight className="h-6 w-6 text-[#808080]" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToPage(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                currentPage === index ? "bg-[#fb6f92] w-4" : "bg-[#808080]/30 hover:bg-[#808080]/50",
              )}
              aria-label={`${index + 1}페이지로 이동`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
