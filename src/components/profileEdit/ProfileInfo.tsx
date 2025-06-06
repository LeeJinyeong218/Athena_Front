"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Camera, Check, Pencil, Plus, X } from "lucide-react"
import PasswordInput from "../common/PasswordInput"
import clsx from "clsx"

interface Profile {
    name: string
    email: string
    image: string | null
}

interface Intro {
    intro: string
    urls: string[]
}

export default function ProfileInfo() {
    // 비밀번호 수정 모드
    const [editingPassword, setEditingPassword] = useState(false);

    const [addingUrl, setAddingUrl] = useState(false)
    // 불러온 프로필
    const [profile, setProfile] = useState<Profile>({
        name: "홍길동",
        email: "hong@gmail.com",
        image: "/project-test.png",
    })
    // 불러온 소개
    const [intro, setIntro] = useState<Intro>({
        intro: "안녕하세요 홍길동입니다. 이메일은 hong@gmail.com입니다. 소개는 여기에 작성합니다.안녕하세요 홍길동입니다. 이메일은 hong@gmail.com입니다. 소개는 여기에 작성합니다.안녕하세요 홍길동입니다. 이메일은 hong@gmail.com입니다. 소개는 여기에 작성합니다.안녕하세요 홍길동입니다. 이메일은 hong@gmail.com입니다. 소개는 여기에 작성합니다.ㄴ",
        urls: ["https://www.google.com", "https://www.naver.com"],
    })
    // 프로필 이미지 관련 상태
    const [profileImage, setProfileImage] = useState<string | null>(profile.image)
    
    const fileInputRef = useRef<HTMLInputElement>(null)

    // 이름 수정 관련 상태
    const [newName, setNewName] = useState(profile.name)

    // 비밀번호 관련 상태
    const [password, setPassword] = useState("")
    const [passwordConfirmed, setPasswordConfirmed] = useState(false);
    const [passwordConfirmError, setPasswordConfirmError] = useState(false);
    const [newPassword, setNewPassword] = useState("")
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("")
    const [passwordConfirmNeedError, setPasswordConfirmNeedError] = useState(false);
    const isMatchNewPassword = newPassword === newPasswordConfirm

    // 소개 관련 상태
    const [newIntroduction, setNewIntroduction] = useState(intro.intro)

    // 링크 관련 상태
    const [newUrls, setNewUrls] = useState<string[]>(intro.urls)
    const [newUrl, setNewUrl] = useState("");

    // 저장 가능 여부
    const [saveable, setSaveable] = useState(false) 
    
    // 프로필 이미지 업로드 핸들러
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target?.result) {
              setProfileImage(e.target.result as string)
            }
          }
          reader.readAsDataURL(file)
        }
        setProfile({...profile, image: profileImage})
    }
    // 프로필 이미지 삭제 핸들러
    const handleRemoveImage = () => {
        setProfileImage(null)
        if (fileInputRef.current) {
        fileInputRef.current.value = ""
        }
    }
    
    // 링크 핸들러
    // 링크 추가 핸들러
    const toggleAddingUrl = () => {
        setAddingUrl(!addingUrl)
        setNewUrl("")
    }

    const handleUrlAdd = () => {
        setNewUrls([...newUrls, newUrl])
        setNewUrl("")
        setAddingUrl(false)
    }

    const handleUrlRemove = (index: number) => {
        setNewUrls(newUrls.filter((_, i) => i !== index))
    }
    
    // 전체 저장 핸들러
    const handleSave = () => {
        // 저장 api 호출
        console.log("save")
        setSaveable(false) // 저장 성공 후 저장 가능 여부 초기화
    }

    // 비밀번호 입력 핸들러
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        setPasswordConfirmError(false)
    }

    // 비밀번호 확인 핸들러
    const handlePasswordConfirm = () => {
        // 백엔드 요청 추가
        if (false) {
            setPasswordConfirmed(true)
            console.log(`${password} confirmed`)
        } else {
            setPasswordConfirmError(true)
            console.log(`${password} not confirmed`)
        }
    }

    // 새 비밀번호 입력 핸들러
    const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value)
    }

    // 새 비밀번호 확인 입력 핸들러
    const handleNewPasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPasswordConfirm(e.target.value)
    }

    // 새 비밀번호 적용 핸들러
    const handleNewPasswordApply = () => {
        //비밀번호 확인 여부 체크
        if (!passwordConfirmed) {
            setPasswordConfirmNeedError(true)
            return
        }
        // 백엔드 요청 추가
        console.log("new password applied")
    }

    // 저장 가능 여부 확인 -> 변화가 있을 때만 저장 가능
    useEffect(() => {
        setSaveable(newName !== profile.name || profileImage !== profile.image || newIntroduction !== intro.intro || newUrls.join(",") !== intro.urls.join(","))
    }, [newName, profileImage, newIntroduction, newUrls])

    return (
        <>
            {!editingPassword ? (
                <div className="flex flex-col gap-4">
                    <div className="flex gap-5 flex-wrap justify-center">
                        {/* 프로필 이미지 섹션 */}
                        <div className="flex flex-col items-center bg-white rounded-lg shadow py-6 px-10 space-y-4">
                            <h3 className="text-lg font-medium">프로필 이미지</h3>
                            <div className="relative w-32 h-32 mb-4">
                                {profileImage ? (
                                <>
                                    <Image
                                    src={profileImage || "/placeholder.svg"}
                                    alt="프로필 이미지"
                                    fill
                                    className="rounded-full object-cover"
                                    />
                                    <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                    <X className="w-4 h-4" />
                                    </button>
                                </>
                                ) : (
                                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                                    <Camera className="w-10 h-10 text-sub-gray" />
                                </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="profile-image"
                            />
                            <label htmlFor="profile-image" className="cursor-pointer text-main-color font-medium hover:text-secondary-color-dark">
                                프로필 사진 {profileImage ? "변경" : "업로드"}
                            </label>

                        </div>
                        
                        {/* 이름, 이메일 란 */}
                        <div className="flex-1 flex flex-col justify-start bg-white rounded-lg shadow p-6 gap-8">
                            <h3 className="text-lg font-medium">프로필 정보</h3>
                            <div className="flex justify-start w-full gap-8 items-center">
                            <div className="flex items-center gap-2">
                                <input
                                    className="w-full px-3 py-2 border border-gray-border rounded-md focus:outline-none focus:ring-2 focus:ring-main-color text-sm"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                /> 
                            </div>
                            </div>
                            <div className="flex justify-start w-full gap-8 items-center">
                                <span className="text-sm font-medium text-sub-gray">이메일</span>
                                <span className="text-sm font-medium">{profile.email}</span>
                            </div>
                            <button
                                className="w-fit bg-main-color text-white rounded-md hover:bg-secondary-color-dark text-sm px-3 py-2"
                                onClick={() => setEditingPassword(true)}
                            >
                                비밀번호 변경
                            </button>
                        </div>   
                    </div>

                    {/* 소개, 링크 란 */}
                    <div className="flex-1 flex flex-col justify-start bg-white rounded-lg shadow p-6 gap-2">
                        <h3 className="text-lg font-medium">소개</h3>  
                        {/* 소개란 */}
                        <textarea
                            className="w-full h-[150px] px-3 py-2 border border-gray-border rounded-md focus:outline-none focus:border-2 focus:border-main-color text-sm resize-none"
                            value={newIntroduction}
                            onChange={(e) => setNewIntroduction(e.target.value)}
                        />
                        {/* 링크란 */}
                        <div className="flex gap-4 items-center flex-wrap">
                            <button onClick={toggleAddingUrl}>
                                <Plus className="w-4 h-4" />
                            </button>
                            {
                                addingUrl &&
                                <form className="flex gap-2 items-center">
                                    <input type="url" className="w-full px-2 py-1 border border-gray-border rounded-md focus:outline-none focus:ring-2 focus:ring-main-color text-sm" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
                                    <button onSubmit={handleUrlAdd}>
                                        <Check className="w-4 h-4" />
                                    </button>
                                </form>
                            }
                            {newUrls.map((url, index) => {
                                return (
                                    <div key={index} className="flex gap-2 items-center rounded-full bg-gray-100 px-4 py-1">
                                        <span>{url}</span>
                                        <button 
                                            onClick={() => handleUrlRemove(index)}
                                            className="text-sub-gray rounded-md text-sm"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div> 
                    <div className="flex gap-2 justify-end items-end flex-wrap">
                        <p className="text-sm font-medium text-sub-gray">※ 저장하지 않고 페이지를 나갈 시 변경사항이 저장되지 않습니다.</p>
                        <button
                            disabled={!saveable}
                            className={clsx("text-white rounded-md text-sm px-4 py-2", saveable ? "bg-main-color hover:bg-secondary-color-dark": "bg-gray-border")}
                            onClick={handleSave}
                        >
                            저장
                        </button>
                    </div>  
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                <div
                    className="flex flex-col gap-6 bg-white rounded-lg shadow p-6"
                >
                    
                    <h3 className="text-lg font-medium">비밀번호 변경</h3>
                    {/* 비밀번호 확인란 */}
                    <div className="flex flex-col gap-6 w-full">
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-sub-gray">비밀번호 확인</p>
                            <div className="flex gap-2">
                                <PasswordInput
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                {
                                    passwordConfirmed ?
                                    <Check className="w-4 h-4 text-green-500" />
                                    :
                                    <div className="flex gap-2 items-center">
                                        <button
                                            type="submit"
                                            onClick={handlePasswordConfirm}
                                            className="w-fit bg-main-color text-white rounded-md hover:bg-secondary-color-dark text-sm px-3 py-2"
                                        >확인</button>
                                        {passwordConfirmError && <p className="text-red-500 text-sm">비밀번호가 일치하지 않습니다.</p>}
                                        {passwordConfirmNeedError && <p className="text-red-500 text-sm">비밀번호 확인이 필요합니다.</p>}
                                    </div>
                                }
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-sub-gray">새 비밀번호 입력</p>
                            <div className="flex gap-2">
                                <PasswordInput
                                    value={newPassword}
                                    onChange={handleNewPasswordChange}
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <p className="text-sm font-medium text-sub-gray">새 비밀번호 확인</p>
                            <div className="flex gap-2">
                                <PasswordInput
                                    value={newPasswordConfirm}
                                    onChange={handleNewPasswordConfirmChange}
                                />
                            </div>
                            {!isMatchNewPassword &&
                            <div className="flex gap-2 items-center text-red-500">
                                <X className="w-4 h-4 " />
                                <p className="text-red-500 text-sm">새 비밀번호가 일치하지 않습니다.</p>
                            </div>}
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button
                            className="w-fit bg-main-color text-white rounded-md hover:bg-secondary-color-dark text-sm px-3 py-2"
                            onClick={handleNewPasswordApply}
                        >
                            저장
                        </button>
                        <button
                            className="w-fit bg-cancel-background text-white rounded-md hover:bg-cancel-background-dark text-sm px-3 py-2"
                            onClick={() => setEditingPassword(false)}
                        >
                            취소
                        </button>
                    </div>
                </div>
                </div>
            )}
        </>
    )
}