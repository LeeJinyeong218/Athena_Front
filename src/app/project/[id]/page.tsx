import ProjectDetail from "@/components/projectDetail/ProjectDetail"
import DonateDock from "@/components/projectDetail/DonateDock"

export default function ProjectDetailPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* 상품 상세 페이지 영역 */}
        <ProjectDetail />
      </div>
      {/* 후원하기 독 영역 */}
      <DonateDock />
    </main>
  )
}
