"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import FollowItem from "../profile/FollowItem"
import { useApi } from "@/hooks/useApi"
import MarkdownRenderer from "../projectRegister/MarkdownRenderer"
import useAuthStore from "@/stores/auth"

interface Review {
  id: number
  userName: string
  content: string
  createdAt: string
  likes?: number
  profileImage?: string
}

// ProjectData 인터페이스 추가
interface ProjectData {
  id: number
  title: string
  description: string
  goalAmount: number
  totalAmount: number
  convertedMarkdown: string
  startAt: string
  endAt: string
  shippedAt: string
  imageUrls: string[]
  sellerResponse: {
    id: number
    sellerIntroduction: string
    linkUrl: string
  }
  productResponses: {
    id: number
    name: string
    description: string
    price: number
    stock: number
    options: string[]
  }[]
}

interface ProjectTabsProps {
  projectData: ProjectData | null
  isLoading: boolean
  error: string | null
}

const ProjectTabs = ({ projectData, isLoading, error }: ProjectTabsProps) => {
  const isLoggedIn = useAuthStore((state: { isLoggedIn: boolean }) => state.isLoggedIn)
  const { apiCall, isLoading: apiLoading } = useApi()
  const [activeTab, setActiveTab] = useState("소개")
  const [reviewText, setReviewText] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsError, setReviewsError] = useState<string | null>(null)

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  // 기본 판매자 정보 (API 데이터가 없을 경우 사용)
  const defaultSeller = {
    id: 101,
    username: "가작가",
    oneLinear: "어? 왜 지가 화를 내지?",
    profileImage: "/abstract-profile.png",
  }

  // 판매자 정보 (API 데이터가 있으면 사용)
  const seller = projectData?.sellerResponse
    ? {
        id: projectData.sellerResponse.id,
        username: "가작가", // API에서 제공하지 않는 정보는 기본값 사용
        oneLinear: projectData.sellerResponse.sellerIntroduction,
        profileImage: "/abstract-profile.png", // API에서 제공하지 않는 정보는 기본값 사용
      }
    : defaultSeller

  const handleFollow = (id: number) => {
    // 팔로우 로직 구현 예정
    console.log(`판매자 ${id} 팔로우`)
  }

  const { id } = useParams()
  const projectId = id

  // 리뷰 데이터 가져오기
  useEffect(() => {
    if (activeTab === "후기") {
      fetchReviews()
    }
  }, [activeTab])

  // fetchReviews 함수
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true)
      setReviewsError(null)

      const { data, error, status } = await apiCall<Review[]>(`/api/comment/${projectId}`, "GET")

      if (error) {
        throw new Error(error)
      }

      if (data) {
        // API 응답 데이터를 컴포넌트에서 사용하는 형식으로 변환
        const formattedReviews = data.map((review: any) => ({
          id: review.id,
          userName: review.userName,
          content: review.content,
          createdAt: review.createdAt,
          likes: 0, // 기본값 설정
          profileImage: "/abstract-profile.png", // 기본 프로필 이미지 설정
        }))

        setReviews(formattedReviews)
      }
    } catch (err) {
      setReviewsError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
      console.error("리뷰 불러오기 오류:", err)
    } finally {
      setReviewsLoading(false)
    }
  }

  // handleReviewSubmit 함수
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reviewText.trim()) return

    try {
      const { data, error, status } = await apiCall("/api/comment/create", "POST", {
        projectId,
        content: reviewText,
      })

      if (error) {
        setReviewsError(error)
        return
      }

      console.log("리뷰 제출 성공:", data)

      // 리뷰 제출 후 입력 필드 초기화 및 리뷰 목록 새로고침
      setReviewText("")
      fetchReviews()
    } catch (err) {
      setReviewsError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
      console.error("리뷰 제출 오류:", err)
    }
  }

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, ". ")
  }

  // 남은 일수 계산 함수
  const calculateDaysLeft = (endDate: string) => {
    if (!endDate) return 0
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }


  // 기본 마크다운 콘텐츠 (API 데이터가 없을 경우 사용)
  const defaultMarkdown = `
  이 판매자는 물건을 팔 생각이 없어 보입니다.
  `

  return (
    <div className="mt-12">
      {/* 로딩 상태 표시 */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <p className="text-sub-gray">프로젝트 정보를 불러오는 중...</p>
        </div>
      )}

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-500 my-4">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-2 text-sm underline">
            다시 시도
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* 탭 메뉴 */}
          <div className="border-b border-gray-border">
            <div className="flex space-x-8">
              {["소개", "프로젝트 정보", "후기"].map((tab) => (
                <button
                  key={tab}
                  className={`relative pb-3 text-xl font-medium ${activeTab === tab ? "text-main-color" : "text-sub-gray"}`}
                  onClick={() => handleTabClick(tab)}
                >
                  {tab}
                  {activeTab === tab && <span className="absolute bottom-0 left-0 h-1 w-full bg-main-color"></span>}
                </button>
              ))}
            </div>
          </div>

          {/* 탭 내용 */}
          <div className="mt-8">
            {activeTab === "소개" && (
              <div className="space-y-8">
                {/* 마크다운 렌더러를 사용하여 프로젝트 소개 내용 표시 */}
                <MarkdownRenderer content={projectData?.convertedMarkdown || defaultMarkdown} />
              </div>
            )}

            {activeTab === "프로젝트 정보" && (
              // 프로젝트 기본 정보 영역
              <div>
                <h2 className="mb-6 text-3xl font-bold">프로젝트 기본 정보</h2>
                <hr className="border-gray-border mb-8" />

                <div className="space-y-6">
                  <div className="flex">
                    <div className="w-1/4 font-medium text-sub-gray">목표금액</div>
                    <div className="w-3/4 font-medium">
                      {projectData?.goalAmount?.toLocaleString() || "10,000,000"}원
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/4 font-medium text-sub-gray">펀딩 기간</div>
                    <div className="w-3/4 font-medium">
                      {formatDate(projectData?.startAt || "")} ~ {formatDate(projectData?.endAt || "")}(
                      {calculateDaysLeft(projectData?.endAt || "")}일 남음)
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/4 font-medium text-sub-gray">결제</div>
                    <div className="w-3/4 font-medium">
                      목표금액 달성 시 {formatDate(projectData?.endAt || "")} 결제 예정
                    </div>
                  </div>

                  <div className="flex">
                    <div className="w-1/4 font-medium text-sub-gray">예상 발송 시작일</div>
                    <div className="w-3/4 font-medium">{formatDate(projectData?.shippedAt || "")}</div>
                  </div>
                </div>

                {/* 판매자 정보 영역 */}
                <h2 className="mt-12 mb-6 text-3xl font-bold">판매자 정보</h2>
                <hr className="border-gray-border mb-6" />

                <FollowItem
                  id={seller.id}
                  username={seller.username}
                  oneLinear={seller.oneLinear}
                  profileImage={seller.profileImage}
                  onFollow={handleFollow}
                  isFollowing={false} // 팔로우 상태는 API에서 가져와야 함
                />

              </div>
            )}

            {activeTab === "후기" && (
              <div className="space-y-6">

                {/* 로딩 상태 표시 */}
                {reviewsLoading && (
                  <div className="flex justify-center py-8">
                    <p className="text-sub-gray">리뷰를 불러오는 중...</p>
                  </div>
                )}

                {/* 에러 메시지 표시 */}
                {reviewsError && (
                  <div className="rounded-xl bg-red-50 p-4 text-red-500">
                    <p>{reviewsError}</p>
                    <button onClick={fetchReviews} className="mt-2 text-sm underline">
                      다시 시도
                    </button>
                  </div>
                )}

                {/* 리뷰 목록 */}
                {!reviewsLoading && !reviewsError && (
                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.id} className="rounded-3xl border border-gray-border p-6 shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="flex space-x-4">
                              {/* 리뷰 작성자 프로필 사진 */}
                              <div className="h-16 w-16 overflow-hidden rounded-full">
                                <Image
                                  src={review.profileImage || "/placeholder.svg"}
                                  alt={`${review.userName} 프로필`}
                                  width={64}
                                  height={64}
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              {/* 리뷰 작성자 이름, 게시 날짜, 내용 */}
                              <div>
                                <h3 className="text-xl font-bold">{review.userName}</h3>
                                <p className="text-sub-gray">{formatDate(review.createdAt)}</p>
                                <div className="mt-3 whitespace-pre-line">{review.content}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center space-x-1">
                                <ThumbsUp className="h-6 w-6" />
                                <span className="text-lg">{review.likes || 0}</span>
                              </button>
                              <button>
                                <ThumbsDown className="h-6 w-6" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center py-8">
                        <p className="text-sub-gray">아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ProjectTabs
