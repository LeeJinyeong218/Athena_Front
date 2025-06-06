"use client"

import type React from "react"

import Image from "next/image"
import { Heart, Check, Pencil, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProjectItemProps {
  id: number
  sellerName: string
  projectName: string
  description: string
  imageUrl: string
  achievementRate: number
  daysLeft: number | null | undefined // null인 경우 판매 종료
  isCompleted: boolean
  projectId: number
  isMy?: boolean
  onClickDelete?: (e: React.MouseEvent<HTMLButtonElement>, id: number) => void
}

export default function ProjectItem({
  id,
  sellerName,
  projectName,
  description,
  imageUrl,
  achievementRate,
  daysLeft,
  isCompleted,
  projectId,
  isMy,
  onClickDelete,
}: ProjectItemProps) {
  // 달성률이 100%를 초과하더라도 게이지 바는 100%까지만 표시
  const progressWidth = Math.min(achievementRate, 100)
  const router = useRouter()

  const handleProjectClick = () => {
    router.push(`/project/${projectId}`)
  }

  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    router.push(`/project/${projectId}/edit`) // 특정 상품 수정 페이지로 이동
  }

  return (
    <div className="mb-8">
      <div className="flex gap-6 relative">
        {/* 상품 이미지 */}
        <div className="relative w-60 h-60 flex-shrink-0">
          {/* 상품 이미지 클릭 시 상품 상세 페이지로 이동 */}
          <div className="w-full h-full cursor-pointer" onClick={handleProjectClick}>
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={projectName}
              width={256}
              height={192}
              className={`w-full h-full object-cover rounded-lg ${isCompleted ? "brightness-50" : ""}`}
            />
          </div>

          {/* 하트 아이콘 */}
          <button
            type="button"
            className="absolute bottom-3 right-3 bg-white p-1.5 rounded-full shadow-md"
            aria-label="좋아요"
          >
            <Heart className="h-5 w-5 text-sub-gray" />
          </button>

          {/* 판매 완료 오버레이 */}
          {isCompleted && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-white cursor-pointer"
              onClick={handleProjectClick}
            >
              <div className="bg-white rounded-full p-2 mb-2">
                <Check className="h-8 w-8 text-sub-gray" />
              </div>
              <div className="text-xl font-bold">판매 종료</div>
            </div>
          )}
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 flex flex-col w-64">
          <div className="mb-1 text-sub-gray">{sellerName}</div>
          <h3 className="text-xl font-medium mb-1">{projectName}</h3>
          <p className="text-gray-700 mb-2 whitespace-pre-wrap break-words line-clamp-2">{description}</p>

          {/* 달성률 게이지 */}
          <div className="mt-auto">
            <div className="flex justify-between mb-1">
              <span className={`font-bold ${isCompleted ? "text-sub-gray" : "text-main-color"}`}>
                {achievementRate}% 달성{isCompleted ? "" : "!"}
              </span>
            </div>

            <div className={`w-full h-2 rounded-full ${isCompleted ? "bg-sub-gray" : "bg-secondary-color"}`}>
              <div
                className={`h-full rounded-full bg-main-color ${isCompleted ? "bg-sub-gray" : "bg-main-color"}`}
                style={{ width: `${progressWidth}%` }}
              ></div>
            </div>

            {/* 남은 일수 또는 종료 메시지 */}
            <div className="text-right mt-1">
              {isCompleted ? (
                <span className="text-sub-gray">종료되었어요.</span>
              ) : (
                <span className="text-sub-gray">{daysLeft}일 남았어요.</span>
              )}
            </div>

            {/* 수정 및 삭제 버튼 - 아래로 이동 */}
            {isMy && (
              <div className="flex gap-4 mt-4 justify-end">
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-main-color text-white rounded-lg hover:bg-secondary-color-dark transition-colors w-full justify-center"
                  onClick={handleEditClick}
                >
                  <Pencil className="h-5 w-5" />
                  <span>수정</span>
                </button>
                <button
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sub-gray rounded-lg hover:bg-gray-100 transition-colors w-full justify-center"
                  onClick={(e) => onClickDelete?.(e, id)}
                >
                  <Trash className="h-5 w-5" />
                  <span>삭제</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
