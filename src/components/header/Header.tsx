"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Percent, Heart, Bell, X, Trash2, LogOut, User, UserLock } from "lucide-react"
import CouponModal from "./CouponModal"
import PopularSearch from "./PopularSearch"
import SearchBar from "./SearchBar"
import { useRouter } from 'next/navigation';
import LoginModal from "../login/LoginModal"
import SignupModal from "../login/SignUpModal"
import useAuthStore from "@/stores/auth"
import { usePathname } from 'next/navigation';
import { useApi } from "@/hooks/useApi";

const uris: Record<string, string> = {
  "전체": "",
  "카테고리": "category",
  "신규": "new",
  "마감임박": "deadline",
}
const Header = () => {
  const { isLoggedIn, role, logout } = useAuthStore();
  const isAdmin = role === "ROLE_ADMIN";
  const { apiCall } = useApi();
  const [user, setUser] = useState<{nickname: string, imageUrl: string} | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [searchWord, setSearchWord] = useState("");
  const [showAuthMenu, setShowAuthMenu] = useState(false);
  const authMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname().split("/")[1];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (authMenuRef.current && !authMenuRef.current.contains(event.target as Node)) {
        setShowAuthMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 로그인 모달 열기 / 닫기
  const openLoginModal = () => {
    setShowLoginModal(true)
  }

  const closeLoginModal = () => {
    setShowLoginModal(false)
  }

  const openSignupModalInLoginModal = () => {
    setShowLoginModal(false)
    setShowSignupModal(true)
  }

  // 회원가입 모달 열기 / 닫기
  const openSignupModal = () => {
    setShowSignupModal(true)
  }

  const closeSignupModal = () => {
    setShowSignupModal(false)
  }

  const handleSearchChange = (word: string) => {
    setSearchWord(word)
  }

  const moveToSearchPage = (word: string) => {
    if (word) {
      router.push(`/search?query=${word}`);
    }
  }

  const handleTabClick = (tab: string) => {
    if (tab === "전체") router.push("/")
    else if (tab === "카테고리") router.push(`/category`)
    else if (tab === "신규") router.push("/new")
    else if (tab === "마감임박") router.push("/deadline")

    setSearchWord("")
  }

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications)
  }

  const handleCouponClick = () => {
    setShowCouponModal(!showCouponModal)
  }

  const handleProfileClick = () => {
    setShowAuthMenu(!showAuthMenu)
  }

  // 유저 정보 조회
  const loadUserInfo = () => {
    apiCall<{id: number, nickname: string, imageUrl: string}>("/api/user/Header", "GET").then(({ data }) => {
      if (data !== null) setUser({
        nickname: data.nickname,
        imageUrl: data.imageUrl,
      })
    })
  }

  const notifications = [
    {
      id: 1,
      message: "가작가님의 새로운 작품이 공개되었습니다! 지금 바로 확인해보세요.",
      date: "2025-04-25",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 2,
      message: "가작가님의 새로운 작품이 공개되었습니다! 지금 바로 확인해보세요.",
      date: "2025-04-25",
      profileImage: "/abstract-profile.png",
    },
    {
      id: 3,
      message: "가작가님의 새로운 작품이 공개되었습니다! 지금 바로 확인해보세요.",
      date: "2025-04-25",
      profileImage: "/abstract-profile.png",
    },
  ]

  useEffect(() => {
    loadUserInfo();
  }, [])

  // 모달 뒷배경 스크롤 방지
  useEffect(() => {
    if (showLoginModal || showSignupModal || showCouponModal) {
      // 모달이 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden"
    }

    return () => {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = ""
    }
  }, [showLoginModal, showSignupModal, showCouponModal])

  return (
    <header className="w-full bg-white shadow-[0_4px_4px_-2px_rgba(0,0,0,0.1)]">
      {showCouponModal && <CouponModal isOpen={showCouponModal} onClose={() => setShowCouponModal(false)} />}
      {showLoginModal && <LoginModal isOpen={showLoginModal} onClose={closeLoginModal} moveToSignupModal={openSignupModalInLoginModal} />}
      {showSignupModal && <SignupModal isOpen={showSignupModal} onClose={closeSignupModal} />}
      <div className="container mx-auto px-4 py-4">
        {/* 상단 헤더 영역 */}
        <div className="flex items-center justify-between">
          {/* 로고와 검색창 */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center">
              <Image src="/src/athenna_logo.png" alt="Athenna 로고" width={40} height={40} className="h-10 w-auto" />
            </Link>
          </div>

          {/* 검색창 및 우측 아이콘 및 프로필 */}
          <div className="flex items-center space-x-6">
            <SearchBar
              isLogin={isLoggedIn}
              searchWord={searchWord}
              onSearchChange={handleSearchChange}
              onSearch={moveToSearchPage}
            />
            
            {
              isLoggedIn ? 
              <>
                <button
                type="button" 
                aria-label="쿠폰"
                onClick={handleCouponClick}
              >
                <Percent className="h-6 w-6 text-sub-gray" />
              </button>
                <button type="button" aria-label="찜 목록">
                <Heart className="h-6 w-6 text-sub-gray" />
              </button>
              <button type="button" aria-label="알림" onClick={toggleNotifications}>
                <Bell className="h-6 w-6 text-sub-gray" />
              </button>
              <div className="relative flex items-center space-x-3">
                {user ?
                  <span className="text-sm font-medium whitespace-nowrap">{user?.nickname}</span>
                  :
                  <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                }
                <div className="relative flex items-center" ref={authMenuRef}>
                  {user ?
                  <button className="h-10 w-10 overflow-hidden rounded-full" onClick={handleProfileClick}>
                    <Image
                      src={user?.imageUrl || "/abstract-profile.png"}
                      alt="프로필 이미지"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </button>
                  :
                  <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
                  }
                  {
                    showAuthMenu &&
                    <div className="absolute right-0 top-12 bg-white shadow-md rounded-md px-4 py-2 flex flex-col gap-2 z-50 transition-all duration-200">
                      {isAdmin &&
                        <button
                        type="button"
                        onClick={() => router.push("/admin/approval")}
                        className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap flex items-center gap-2 p-2 justify-center"
                      >
                        <UserLock className="h-4 w-4" />
                        관리자페이지
                      </button>
                      }
                      <button
                        type="button"
                        onClick={() => router.push("/my")}
                        className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap flex items-center gap-2 p-2 justify-center"
                      >
                        <User className="h-4 w-4" />
                        마이페이지
                      </button>
                      <button
                          type="button"
                          onClick={logout}
                          className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap flex items-center gap-2 p-2 justify-center"
                      >
                          <LogOut className="h-4 w-4" />
                          로그아웃
                      </button>
                    </div>
                  }
                </div>
              </div>
              </>
              :
              <div className="text-main-color font-medium mr-auto flex items-center gap-2">
                <button type="button" aria-label="로그인" onClick={openLoginModal}>
                  로그인
                </button>
                /
                <button type="button" aria-label="로그인" onClick={openSignupModal}>
                  회원가입
                </button>
              </div>
            }

            
          </div>
        </div>

        {/* 하단 네비게이션 탭 */}
        <div className="mt-4 flex justify-between items-center">
          <nav className="flex space-x-8">
            {["전체", "카테고리", "신규", "마감임박"].map((tab) => (
              <button
                type="button"
                key={tab}
                className={`relative pb-1 text-base font-medium ${
                  pathname === uris[tab] ? "text-main-color" : "text-sub-gray"
                }`}
                onClick={() => handleTabClick(tab)}
              >
                {tab}
                {pathname === uris[tab] && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-main-color" />}
              </button>
            ))}
          </nav>
          <PopularSearch onSearchChange={handleSearchChange} onSearch={moveToSearchPage}/>
        </div>
      </div>

      {/* 알림 패널 */}
      {showNotifications && (
        <div className="absolute right-4 top-20 z-50 w-96 rounded-2xl border border-gray-border bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">알림</h2>
            <div className="flex items-center space-x-4">
              <button type="button" className="text-sm text-sub-gray">모두 지우기</button>
              <button type="button" onClick={toggleNotifications}>
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div>
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <div className="flex py-4">
                  <div className="mr-4 h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={notification.profileImage || "/placeholder.svg"}
                      alt="프로필 이미지"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1">{notification.message}</p>
                    <p className="text-sm text-sub-gray">{notification.date}</p>
                  </div>
                  <button type="button" className="ml-2 text-sub-gray">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                {index < notifications.length - 1 && <hr className="border-gray-border" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
