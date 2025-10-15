'use client'

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import $api from "@/hooks/api"
import { IUser } from "@/types/users"

import { Link } from '@/i18n/navigation'

import styles from "./Profile.module.scss"

export default function Profile() {
  const { data, status } = useSession()
  const router = useRouter()
  const t = useTranslations()
  const [showLangs, setShowLangs] = useState(false)
  const [userData, setUserData] = useState<IUser | null>(null)

  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/register")
    }
  }, [status, router])

  // Получаем данные пользователя из базы по email
  useEffect(() => {
    const fetchUserData = async () => {
      if (!data?.user?.email) return
     
      try {
        const response = await $api.post("users/get-with-email", { 
          email: data.user.email 
        })
        setUserData(response.data)
        
      } catch  {
        console.error("Error fetching user data")
      }
    }

    if (data?.user?.email) {
      fetchUserData()
    }
  }, [data?.user?.email])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangs(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (!data?.user) return null

  const avatar = data.user.image || "/default-avatar.png"

  return (
    <div>
      <div className={styles.user__profile}>
        <div className={styles.user__info}>
          <Image
            src={avatar}
            alt={data.user.name || "User avatar"}
            width={40}
            height={40}
          />
         <div>
           <span>{data.user.name} </span>
           <br />
          <span className={styles.user__email}>{data.user.email}</span>
         </div>
        </div>

        <div className={styles.lang__wrapper} ref={langRef}>
          <button className={styles.lang__btn} onClick={() => setShowLangs(!showLangs)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
              <rect width="100%" height="100%" fill="black" rx="12" ry="12"/>
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" stroke="white" strokeWidth="1" fill="none"/>
              <line x1="12" y1="2" x2="12" y2="22" stroke="white" strokeWidth="1"/>
              <line x1="7" y1="4" x2="17" y2="20" stroke="white" strokeWidth="1"/>
              <line x1="17" y1="4" x2="7" y2="20" stroke="white" strokeWidth="1"/>
            </svg>
          </button>
          {showLangs && (
            <div className={styles.lang__menu}>
              <Link href="/profile" locale="en">English</Link>
              <Link href="/profile" locale="ru">Русский</Link>
              <Link href="/profile" locale="uz">O&apos;zbek</Link>
            </div>
          )}
        </div>
      </div>

      <br />
          
 <br />
 <br />
     
      <button className={styles.btn} onClick={() => signOut()}>{t("sign_out")}</button>
    </div>
  )
}