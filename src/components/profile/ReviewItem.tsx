"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ReviewModal from "./ReviewModal"

interface ReviewItemProps {
  id: number
  sellerName: string
  projectName: string
  reviewDate: string
  reviewContent: string
  imageUrl: string
  projectId: number
}

export default function ReviewItem({
  id,
  sellerName,
  projectName,
  reviewDate,
  reviewContent,
  imageUrl,
  projectId,
}: ReviewItemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleProjectClick = () => {
    router.push(`/project/${projectId}`)
  }

  return (
    <>
      <div className="mb-6 sm:mb-8" data-cy="comment-item">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
          {/* 영역 1: 상품 이미지 */}
          <div className="relative w-full h-40 sm:w-60 sm:h-60 flex-shrink-0">
            {/* 상품 이미지 클릭 시 상품 상세 페이지로 이동 */}
            <div className="w-full h-full cursor-pointer" onClick={handleProjectClick} data-cy="project-image">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={projectName}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* 영역 2, 3: 후기 내용 */}
          <div className="flex-1 flex flex-col w-full sm:w-64">
            {/* 영역 2: 판매자/상품 정보, 날짜 및 좋아요/싫어요 */}
            <div className="mb-2">
              {/* 판매자 및 상품 정보 */}
              <div className="mb-1 text-sub-gray text-sm sm:text-base" data-cy="seller-name">{sellerName} 님의 상품</div>
              <h3 className="text-base sm:text-xl font-medium mb-1" data-cy="project-name">{projectName}</h3>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 mb-2">
              <div className="text-gray-500 text-xs sm:text-base" data-cy="review-date">{reviewDate} 에 작성</div>
              <div className="flex items-center gap-2 sm:gap-4">
              </div>
            </div>

            {/* 영역 3: 댓글 내용 카드 */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex-grow bg-white rounded-2xl border border-gray-200 px-2 py-2 sm:px-4 sm:py-3 text-left overflow-hidden shadow-sm hover:shadow-md transition-shadow mt-auto"
            >
              <div className="overflow-hidden">
                <p className="line-clamp-4 text-gray-700 whitespace-pre-wrap break-words text-xs sm:text-base" data-cy="review-content">{reviewContent}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 댓글 모달 */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reviewContent={reviewContent}
        reviewDate={reviewDate}
      />
    </>
  )
}
