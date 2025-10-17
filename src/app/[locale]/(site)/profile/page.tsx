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
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const langRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/register")
    }
  }, [status, router])

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

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedIndex(index)
      setTimeout(() => setCopiedIndex(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  if (!data?.user) return null

  const avatar = data.user.image || "/default-avatar.png"

  return (
    <div className={styles.container}>
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
      <div className={styles.userDatas}>
        <div className={styles.userStatus}>
          <div className={styles.statusContainer}>
            <span>Draft</span> <span>{userData?.draft}</span>
          </div>
          <div className={styles.statusContainer}>
            <span>Local</span> <span>{userData?.local}</span>
          </div>
          <div className={styles.statusContainer}>
            <span>Public</span> <span>{userData?.public}</span>
          </div>
          <div className={styles.statusContainer}>
            <span>Private</span> <span>{userData?.private}</span>
          </div>
          <div className={styles.statusContainer}>
            <span>Expire</span> <span>{userData?.expire}</span>
          </div>
          <div className={styles.statusContainer}>
            <span>User add</span> <span>{userData?.users_connect}</span>
          </div>
        </div>

        {userData?.user_tests && userData.user_tests.length > 0 && (
          <div className={styles.testsSection}>
            <h5 className={styles.testsTitle}>Your Tests</h5>
            <div className={styles.testsList}>
              {userData.user_tests.map((test, index) => (
                <div key={index} className={styles.testItem}>
                  <span className={styles.testText}>
                    {test.length > 24 ? `${test.substring(0, 24)}...` : test}
                  </span>
                  <button 
                    className={`${styles.copyBtn} ${copiedIndex === index ? styles.copied : ''}`}
                    onClick={() => handleCopy(test, index)}
                  >
                    {copiedIndex === index ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
          
      <br />
     <br />
   <div className={styles.btn__wrapper}>
  <button className={styles.btn} onClick={() => signOut()}>{t("sign_out")}</button>
</div>
    </div>
  )
}